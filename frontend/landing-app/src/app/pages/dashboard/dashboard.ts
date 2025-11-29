// src/app/pages/dashboard/dashboard.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule],
})
export class DashboardComponent {
  // Valores usados en el HTML
  avgRate = 0;        // tasa promedio
  totalClients = 0;   // número de clientes
  avgQuota = 0;       // cuota promedio

  constructor(private router: Router) {}

  // ====== HEADER ======
  onLogout() {
    // Aquí luego puedes limpiar tokens, etc.
    this.router.navigate(['/login']);
  }

  // ====== BOTONES PRINCIPALES ======
  onNewSimulation() {
    console.log('Nueva simulación (pendiente de implementar)');
  }

  onRegisterClient() {
    this.router.navigate(['/clientes/registrar']);
  }

  onRegisterHouse() {
    this.router.navigate(['/viviendas/registrar']);
  }

  onViewHouses() {
    console.log('Ver viviendas (pendiente de implementar)');
    // this.router.navigate(['/viviendas']);  // cuando tengas esa ruta
  }

  onViewClients() {
    console.log('Ver clientes (pendiente de implementar)');
    // this.router.navigate(['/clientes']);   // cuando tengas esa ruta
  }

  onViewPaymentPlans() {
    console.log('Ver planes de pago (pendiente de implementar)');
  }

  onViewReports() {
    console.log('Ver reportes (pendiente de implementar)');
  }

  onViewHistory() {
    console.log('Ver historial de simulaciones (pendiente de implementar)');
  }
}
