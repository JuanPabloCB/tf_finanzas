import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  message: string = "";

  constructor(private authService: AuthService) {}

  onLogin() {
    console.log('onLogin called', { email: this.email, password: this.password ? '***' : '' });
    this.message = 'Enviando credenciales...';
    this.authService.login(this.email, this.password).subscribe(
      (res: any) => {
        console.log('login response', res);
        if (res.success) {
          this.message = "✔ Inicio de sesión exitoso";
        } else {
          this.message = "❌ Usuario o contraseña incorrectos";
        }
      },
      (err) => {
        console.error('login error', err);
        this.message = "❌ Error con el servidor";
      }
    );
  }
}
