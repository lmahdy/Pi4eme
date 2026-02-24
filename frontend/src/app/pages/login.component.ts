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
    <div class="card login-card">
      <h2>{{ 'LOGIN.TITLE' | translate }}</h2>
      <p>{{ 'LOGIN.SUBTITLE' | translate }}</p>
      <form (ngSubmit)="submit()">
        <label>{{ 'LOGIN.EMAIL' | translate }}</label>
        <input type="email" [(ngModel)]="email" name="email" required />

        <label>{{ 'LOGIN.PASSWORD' | translate }}</label>
        <input type="password" [(ngModel)]="password" name="password" required />

        <button class="button" type="submit">{{ 'LOGIN.SUBMIT' | translate }}</button>
      </form>
      <p class="hint">
        {{ 'LOGIN.NEW_HERE' | translate }} 
        <a routerLink="/signup">{{ 'LOGIN.CREATE_ACCOUNT' | translate }}</a>
      </p>

      <a href="http://localhost:3000/auth/github" style="text-decoration: none;">
  <button type="button" class="github-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755
      -1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 
      3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
      0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 
      3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 
      2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
      1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 
      2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 
      24 17.295 24 12c0-6.63-5.37-12-12-12"/>
    </svg>
    Continue with GitHub
  </button>
</a>
    </div>
  `,
  styles: [
    `
      .login-card {
        max-width: 420px;
        margin: 40px auto;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      input {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
      }

      .hint {
        font-size: 12px;
        color: #6b7280;
        margin-top: 12px;
      }

      .github-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        padding: 10px 16px;
        background-color: #24292e;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 12px;
        transition: background-color 0.2s;
      }

      .github-btn:hover {
        background-color: #3a3f44;
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
}
