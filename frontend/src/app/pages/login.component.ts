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
    `,
  ],
})
export class LoginComponent {
  email = 'owner@demo.com';
  password = 'Password123!';

  constructor(private authService: AuthService, private router: Router) { }

  submit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/sales']),
      error: () => alert('Login failed. Check credentials.'),
    });
  }
}
