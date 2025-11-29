import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-register',
  standalone: true,
  templateUrl: './client-register.html',
  styleUrls: ['./client-register.css'],
  imports: [CommonModule, FormsModule],
})
export class ClientRegisterComponent {
  // Modelo del cliente para los [(ngModel)]
  client = {
    dni: '',
    first_name: '',
    last_name_p: '',
    last_name_m: '',
    birth_date: '',
    email: '',
    phone: '',
    occupation: '',
    company: '',
    years_at_job: null as number | null,
    months_at_job: null as number | null,
    monthly_income: null as number | null,
    marital_status: '',
    dependents: null as number | null,
  };

  // Popup
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Guardar cliente
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.openModal(
        'error',
        'Datos incompletos',
        'Por favor completa todos los campos obligatorios y corrige los campos marcados.'
      );
      return;
    }

    this.http.post('/api/clients', this.client).subscribe({
      next: (resp) => {
        console.log('== CLIENTE REGISTRADO ==', resp);
        this.openModal(
          'success',
          'Cliente registrado',
          'El cliente se registró correctamente.'
        );
        form.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.openModal(
          'error',
          'Error al registrar',
          'Ocurrió un problema al registrar el cliente. Intenta nuevamente.'
        );
      },
    });
  }

  // Botón "Cancelar" → Dashboard
  onCancel() {
    this.router.navigate(['/dashboard']);
  }

  // Botón extra tipo "Volver al dashboard"
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
