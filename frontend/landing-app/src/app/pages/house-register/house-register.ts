// src/app/pages/house-register/house-register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-house-register',
  standalone: true,
  templateUrl: './house-register.html',
  styleUrls: ['./house-register.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class HouseRegisterComponent {
  // ===== Modelo de vivienda para los [(ngModel)] =====
  private getEmptyHouse() {
    return {
      code: '',
      project_name: '',
      property_type: '',
      status: '',
      department: '',
      province: '',
      district: '',
      address: '',
      property_value: null as number | null,
      down_payment: null as number | null,
      built_area: null as number | null,
      total_area: null as number | null,
      bedrooms: null as number | null,
      bathrooms: null as number | null,
      has_parking: '',
      first_home: '',
      bank: '',
    };
  }

  house = this.getEmptyHouse();

  // ===== Popup =====
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ===== Guardar vivienda =====
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.openModal(
        'error',
        'Datos incompletos',
        'Por favor completa todos los campos obligatorios y corrige los campos marcados.'
      );
      return;
    }

    this.http.post('/api/houses', this.house).subscribe({
      next: (resp) => {
        console.log('== VIVIENDA REGISTRADA ==', resp);
        this.openModal(
          'success',
          'Vivienda registrada',
          'La vivienda se registró correctamente.'
        );
        // limpiar modelo y formulario
        this.house = this.getEmptyHouse();
        form.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.openModal(
          'error',
          'Error al registrar',
          'Ocurrió un problema al registrar la vivienda. Intenta nuevamente.'
        );
      },
    });
  }

  // ===== Botón "Borrar todo" =====
  clearForm() {
    this.house = this.getEmptyHouse();
  }

  // ===== Navegación =====
  goToDashboard() {
    this.router.navigate(['/dashboard']);
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
