// src/app/pages/register/register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password2 = ''; // confirmar contraseña

  // mensajes
  mensajeOk = '';
  mensajeError = '';

  // modal
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // acepta con o sin parámetro para que funcione (click)="onSubmit()"
  // y también (ngSubmit)="onSubmit(registerForm)"
  onSubmit(form?: NgForm) {
    if (form && form.invalid) {
      return;
    }

    if (this.password !== this.password2) {
      this.mensajeOk = '';
      this.mensajeError = 'Las contraseñas no coinciden.';
      this.modalType = 'error';
      this.modalTitle = 'Error';
      this.modalMessage = this.mensajeError;
      this.showModal = true;
      return;
    }

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      password2: this.password2,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario registrado correctamente';
        this.mensajeError = '';
        this.modalType = 'success';
        this.modalTitle = 'Registro exitoso';
        this.modalMessage = this.mensajeOk;
        this.showModal = true;
        form?.resetForm();
      },
      error: (err) => {
        this.mensajeOk = '';
        this.mensajeError =
          err?.error?.detail || 'Ocurrió un error al registrar el usuario';
        this.modalType = 'error';
        this.modalTitle = 'Error';
        this.modalMessage = this.mensajeError;
        this.showModal = true;
      },
    });
  }

  closeModal() {
    this.showModal = false;
  }
}
