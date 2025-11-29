import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ClientRegisterComponent } from './pages/client-register/client-register';
import { HouseRegisterComponent } from './pages/house-register/house-register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent },

  // Registro de Cliente
  { path: 'clientes/registrar', component: ClientRegisterComponent },

  // Registro de Vivienda
  { path: 'viviendas/registrar', component: HouseRegisterComponent },

  // Wildcard (cualquier ruta inválida)
  { path: '**', redirectTo: 'login' },
];
