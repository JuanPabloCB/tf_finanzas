// src/app/pages/simulation/simulation.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

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

type AmortizationMethod = 'frances' | 'aleman' | 'americano';

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
  method: AmortizationMethod = 'frances';
  applyBBP = false;

  // resultados
  financedAmount: number | null = null;
  monthlyPayment: number | null = null;

  // popup genérico
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  // popup para nombrar simulación
  showNameModal = false;
  simulationName = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadHouses();
  }

  // ===== CARGAR DATOS BASE =====
  loadClients() {
    this.http.get<Client[]>('/api/clients').subscribe({
      next: (data) => (this.clients = data || []),
      error: () =>
        this.openModal('error', 'Error al cargar clientes', 'Intenta otra vez.'),
    });
  }

  loadHouses() {
    this.http.get<House[]>('/api/houses').subscribe({
      next: (data) => (this.houses = data || []),
      error: () =>
        this.openModal('error', 'Error al cargar viviendas', 'Intenta otra vez.'),
    });
  }

  // ===== GETTERS PARA RESUMEN =====
  get selectedClient(): Client | undefined {
    if (this.selectedClientId == null) return undefined;
    return this.clients.find((c) => c.id === this.selectedClientId);
  }

  get selectedHouse(): House | undefined {
    if (this.selectedHouseId == null) return undefined;
    return this.houses.find((h) => h.id === this.selectedHouseId);
  }

  // ===== LÓGICA DE SIMULACIÓN =====
  onSimulate() {
    if (!this.selectedClient || !this.selectedHouse) {
      this.openModal('error', 'Faltan datos', 'Selecciona cliente y vivienda.');
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

    // número de cuotas
    const n = this.years * 12;
    if (n <= 0) {
      this.openModal('error', 'Plazo inválido', 'El plazo debe ser mayor a 0.');
      return;
    }

    // tasa mensual
    const i = this.annualRate / 100 / 12;

    let cuotaMensual: number;

    switch (this.method) {
      case 'frances': {
        // cuota constante
        cuotaMensual = (principal * i) / (1 - Math.pow(1 + i, -n));
        break;
      }
      case 'aleman': {
        // amortización constante + interés sobre saldo
        const amortizacionFija = principal / n;
        const interesPrimerMes = principal * i;
        cuotaMensual = amortizacionFija + interesPrimerMes;
        break;
      }
      case 'americano': {
        // se pagan solo intereses y al final el principal
        cuotaMensual = principal * i;
        break;
      }
      default: {
        cuotaMensual = (principal * i) / (1 - Math.pow(1 + i, -n));
        break;
      }
    }

    this.financedAmount = Math.round(principal);
    this.monthlyPayment = Math.round(cuotaMensual);

    // En vez de mostrar éxito directamente, abrimos el popup de nombre
    this.openNameModal();
  }

  // ===== POPUP GENÉRICO =====
  openModal(type: 'success' | 'error', title: string, message: string) {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ===== POPUP NOMBRE DE SIMULACIÓN =====
  private buildDefaultName(): string {
    const client = this.selectedClient;
    const house = this.selectedHouse;

    const clienteTxt = client
      ? `${client.first_name} ${client.last_name_p} (${client.dni})`
      : 'Sin cliente';

    const vivTxt = house ? `${house.project_name} - ${house.code}` : 'Sin vivienda';

    const today = new Date();
    const fecha = today.toLocaleDateString('es-PE');

    return `Simulación MiVivienda - ${clienteTxt} - ${vivTxt} - ${fecha}`;
  }

  openNameModal() {
    this.simulationName = this.buildDefaultName();
    this.showNameModal = true;
  }

  cancelName() {
    this.showNameModal = false;
    // si quieres, también podrías resetear financedAmount/monthlyPayment aquí
    // this.financedAmount = null;
    // this.monthlyPayment = null;
  }

  confirmName() {
    const name = this.simulationName.trim();
    if (!name) {
      this.openModal(
        'error',
        'Nombre requerido',
        'Debes ingresar un nombre para la simulación.'
      );
      return;
    }

    this.showNameModal = false;

    // 🔜 Aquí luego llamaremos al backend para guardar la simulación
    // y redirigir al plan de pagos con el ID que devuelva
    console.log('Simulación nombrada como:', name);

    this.openModal(
      'success',
      'Simulación guardada',
      `La simulación "${name}" fue generada correctamente.`
    );

    // Ejemplo de redirección futura:
    // this.router.navigate(['/plan-pagos'], { queryParams: { simulationId: resp.id } });
  }
}
