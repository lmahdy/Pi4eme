import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'bi_token';
  private apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.access_token);
        }),
      );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  signup(payload: {
    email: string;
    password: string;
    role: 'CompanyOwner' | 'Accountant';
    companyName?: string;
    taxRate?: number;
    currency?: string;
    notificationEmail?: string;
    companyId?: string;
  }) {
    return this.http
      .post<{ access_token: string }>(`${this.apiBase}/auth/signup`, payload)
      .pipe(
        tap((response) => localStorage.setItem(this.tokenKey, response.access_token)),
      );
  }
}
