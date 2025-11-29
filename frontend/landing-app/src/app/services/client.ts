import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientRequest {
  dni: string;
  first_name: string;
  last_name_p: string;
  last_name_m: string;
  birth_date: string;
  email: string;
  phone: string;
  occupation: string;
  company?: string;
  years_at_job: number;
  months_at_job: number;
  monthly_income: number;
  marital_status: string;
  dependents: number;
}

export interface BasicResponse {
  success: boolean;
  detail: string;
  name?: string | null;
  email?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  registerClient(payload: ClientRequest): Observable<BasicResponse> {
    return this.http.post<BasicResponse>(`${this.apiUrl}/clients`, payload);
  }
}
