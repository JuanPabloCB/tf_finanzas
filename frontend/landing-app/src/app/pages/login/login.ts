// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService, LoginPayload } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  mensajeOk = '';
  mensajeError = '';
  loading = false;

  // ===== POPUP (para errores) =====
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'error'; // lo usamos solo para errores ahora

  constructor(private auth: AuthService, private router: Router) {}

  private openModalError(message: string) {
    this.modalType = 'error';
    this.modalTitle = 'Error al iniciar sesión';
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.mensajeOk = '';
    this.mensajeError = '';

    // ===== Validación de campos vacíos (popup error) =====
    if (!this.email || !this.password) {
      const msg = 'Correo y contraseña son obligatorios.';
      this.mensajeError = msg;
      this.openModalError(msg);
      return;
    }

    this.loading = true;

    const payload: LoginPayload = {
      email: this.email,
      password: this.password,
    };

    console.log('Enviando payload de login:', payload);

    this.auth.login(payload).subscribe({
      next: (res) => {
        console.log('Respuesta de login:', res);
        this.loading = false;

        if (res.success) {
          // ✅ Login correcto → mensaje simple (por ahora)
          this.mensajeOk = res.detail || 'Login exitoso desde Python 😎';
          alert(this.mensajeOk);
          // Aquí luego ya harás: this.router.navigate(['/home']);
        } else {
          // ❌ Credenciales incorrectas → popup diseñado
          const msg = res.detail || 'Usuario o contraseña incorrectos.';
          this.mensajeError = msg;
          this.openModalError(msg);
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading = false;

        const msg = 'Error de conexión con el servidor.';
        this.mensajeError = msg;
        this.openModalError(msg);
      },
    });
  }
}
