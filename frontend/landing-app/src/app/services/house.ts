// src/app/services/house.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HouseRequest {
  code: string;              // Código interno de la vivienda
  project_name: string;      // Nombre del proyecto
  property_type: string;     // Departamento, Casa, Dúplex, etc.
  status: string;            // En planos, construcción, entrega inmediata
  department: string;
  province: string;
  district: string;
  address: string;           // Dirección exacta
  property_value: number;    // Valor del inmueble (S/)
  down_payment: number;      // Cuota inicial (S/)
  built_area: number;        // Área construida (m²)
  total_area: number;        // Área total (m²)
  bedrooms: number;
  bathrooms: number;
  has_parking: string;       // "si" | "no"
  first_home: string;        // "si" | "no"
  bank?: string;             // Banco asociado (opcional)
}

export interface BasicResponse {
  success: boolean;
  detail: string;
}

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  registerHouse(payload: HouseRequest): Observable<BasicResponse> {
    // Cuando definas /api/houses en FastAPI, esto ya quedará conectado
    return this.http.post<BasicResponse>(`${this.apiUrl}/houses`, payload);
  }
}
