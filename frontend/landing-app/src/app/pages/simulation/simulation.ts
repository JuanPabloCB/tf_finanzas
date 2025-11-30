// src/app/pages/simulation/simulation.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Client {
  id: number;
  dni: string;
  first_name: string;
  last_name_p: string;
}

interface House {
  id: number;
  code: string;
  district: string;
  project_name: string;
  property_value: number;
  down_payment: number;
}

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './simulation.html',
  styleUrls: ['./simulation.css'],
})
export class SimulationComponent implements OnInit {
  // listas que vienen del backend
  clients: Client[] = [];
  houses: House[] = [];

  // selección en pantalla
  selectedClientId: number | null = null;
  selectedHouseId: number | null = null;

  // parámetros de la simulación
  currency: 'PEN' | 'USD' = 'PEN';
  bank = '';
  annualRate = 10; // TEA %
  years = 20; // plazo en años
  graceMonths = 0;
  applyBBP = false;

  // 👉 nuevo: método de amortización
  method: 'frances' | 'aleman' | 'americano' = 'frances';

  // resultados
  financedAmount: number | null = null;
  monthlyPayment: number | null = null;

  // popup
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadHouses();
  }

  loadClients() {
    this.http.get<Client[]>('/api/clients').subscribe({
      next: (data) => (this.clients = data || []),
      error: () =>
        this.openModal(
          'error',
          'Error al cargar clientes',
          'Intenta otra vez.'
        ),
    });
  }

  loadHouses() {
    this.http.get<House[]>('/api/houses').subscribe({
      next: (data) => (this.houses = data || []),
      error: () =>
        this.openModal(
          'error',
          'Error al cargar viviendas',
          'Intenta otra vez.'
        ),
    });
  }

  // ✅ getters
  get selectedClient(): Client | undefined {
    if (this.selectedClientId == null) return undefined;
    return this.clients.find((c) => c.id === this.selectedClientId);
  }

  get selectedHouse(): House | undefined {
    if (this.selectedHouseId == null) return undefined;
    return this.houses.find((h) => h.id === this.selectedHouseId);
  }

  // ===== Simulación en front con 3 métodos =====
  onSimulate() {
    if (!this.selectedClient || !this.selectedHouse) {
      this.openModal(
        'error',
        'Faltan datos',
        'Selecciona cliente y vivienda.'
      );
      return;
    }

    const house = this.selectedHouse;
    const baseValue = Number(house?.property_value || 0);
    const down = Number(house?.down_payment || 0);
    const principal = baseValue - down;

    if (principal <= 0) {
      this.openModal(
        'error',
        'Monto inválido',
        'El valor del inmueble debe ser mayor a la cuota inicial.'
      );
      return;
    }

    if (this.annualRate <= 0 || this.years <= 0) {
      this.openModal(
        'error',
        'Parámetros inválidos',
        'La TEA y el plazo deben ser mayores a 0.'
      );
      return;
    }

    const n = this.years * 12; // número de cuotas
    const i = this.annualRate / 100 / 12; // tasa mensual (aprox, luego lo refinamos si quieres)

    let cuota: number;

    switch (this.method) {
      case 'frances': {
        // Cuota fija
        cuota = (principal * i) / (1 - Math.pow(1 + i, -n));
        break;
      }

      case 'aleman': {
        // Amortización de capital fija; mostramos la PRIMERA cuota
        const amortCap = principal / n;
        const interes1 = principal * i;
        cuota = amortCap + interes1;
        break;
      }

      case 'americano': {
        // Solo intereses en meses 1..n-1; mostramos esa cuota
        cuota = principal * i;
        break;
      }

      default: {
        cuota = (principal * i) / (1 - Math.pow(1 + i, -n));
      }
    }

    this.financedAmount = Math.round(principal);
    this.monthlyPayment = Math.round(cuota);

    const symbol = this.currency === 'PEN' ? 'S/' : '$';
    const methodLabel =
      this.method === 'frances'
        ? 'Francés'
        : this.method === 'aleman'
        ? 'Alemán'
        : 'Americano';

    this.openModal(
      'success',
      'Simulación generada',
      `Método: ${methodLabel}. La cuota mensual estimada es ${symbol} ${this.monthlyPayment}`
    );
  }

  // ===== Popup =====
  openModal(type: 'success' | 'error', title: string, message: string) {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
