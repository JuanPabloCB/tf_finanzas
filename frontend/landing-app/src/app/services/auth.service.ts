// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// === Interfaces de payload / respuesta ===
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  detail: string;
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(data: RegisterPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, data);
  }
}
