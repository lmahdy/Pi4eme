import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="auth-shell">
      <div class="card login-card">
        <h2>{{ 'LOGIN.TITLE' | translate }}</h2>
        <p class="subtitle">{{ 'LOGIN.SUBTITLE' | translate }}</p>
        <form (ngSubmit)="submit()">
          <label>{{ 'LOGIN.EMAIL' | translate }}</label>
          <input type="email" [(ngModel)]="email" name="email" required />

          <label>{{ 'LOGIN.PASSWORD' | translate }}</label>
          <input type="password" [(ngModel)]="password" name="password" required />

          <button class="button full-width" type="submit">{{ 'LOGIN.SUBMIT' | translate }}</button>

          <button class="link-button" type="button" (click)="goToForgot()">
            {{ 'LOGIN.FORGOT' | translate }}
          </button>
        </form>
        <p class="hint">
          {{ 'LOGIN.NEW_HERE' | translate }} 
          <a routerLink="/signup">{{ 'LOGIN.CREATE_ACCOUNT' | translate }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-shell {
        min-height: calc(100vh - 80px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
      }

      .login-card {
        max-width: 560px;
        width: 100%;
        padding: 28px 32px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      input {
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        font-size: 14px;
      }

      .subtitle {
        font-size: 13px;
        color: #6b7280;
        margin-bottom: 16px;
      }

      .full-width {
        width: 100%;
        margin-top: 4px;
      }

      .hint {
        font-size: 12px;
        color: #6b7280;
        margin-top: 12px;
      }

      .link-button {
        margin-top: 8px;
        padding: 0;
        border: none;
        background: none;
        color: #2563eb;
        font-size: 13px;
        text-align: left;
        cursor: pointer;
      }

      .link-button:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  submit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/sales']),
      error: (error) => {
        const message = error.error?.message || 'Login failed. Check credentials.';
        alert(message);
      },
    });
  }

  goToForgot() {
    this.router.navigate(['/forgot-password']);
  }
}
