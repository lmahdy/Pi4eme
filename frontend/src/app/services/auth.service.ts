import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'bi_token';
  private apiBase = 'http://localhost:3000';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  isLoggedIn$ = this.loggedIn.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.loggedIn.next(true);
        }),
      );
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  signup(payload: any) {
    return this.http
      .post<{ access_token: string }>(`${this.apiBase}/auth/signup`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.loggedIn.next(true);
        })
      );
  }
}
