import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="auth-shell">
      <div class="card reset-card">
        <h2>{{ 'RESET.TITLE' | translate }}</h2>
        <p class="subtitle">{{ 'RESET.SUBTITLE' | translate }}</p>

        <form (ngSubmit)="submit()" *ngIf="!submitted">
          <label>{{ 'RESET.EMAIL' | translate }}</label>
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            required
          />

          <button class="button full-width" type="submit">
            {{ 'RESET.REQUEST' | translate }}
          </button>

          <p class="hint" *ngIf="error">{{ error }}</p>
        </form>

        <div *ngIf="submitted">
          <p class="info-text">
            {{ 'RESET.EMAIL_SENT' | translate }}
          </p>
          <button class="button full-width" type="button" (click)="goToLogin()">
            {{ 'SIGNUP.LOGIN' | translate }}
          </button>
        </div>
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

      .reset-card {
        max-width: 520px;
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
        color: #b91c1c;
        margin-top: 12px;
      }

      .info-text {
        font-size: 14px;
        color: #4b5563;
        margin: 12px 0 16px;
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  email = '';
  submitted = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  submit() {
    this.error = '';

    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.submitted = true;
      },
      error: () => {
        this.error = this.translate.instant('RESET.REQUEST_FAILED');
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

