import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="auth-shell">
      <div class="card reset-card">
        <h2>{{ 'RESET.TITLE' | translate }}</h2>
        <p class="subtitle">{{ 'RESET.SUBTITLE_CHANGE' | translate }}</p>

        <form (ngSubmit)="submit()" *ngIf="!completed">
          <label>{{ 'RESET.NEW_PASSWORD' | translate }}</label>
          <input
            type="password"
            [(ngModel)]="newPassword"
            name="newPassword"
            minlength="8"
            required
          />

          <label>{{ 'RESET.CONFIRM_PASSWORD' | translate }}</label>
          <input
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            minlength="8"
            required
          />

          <button class="button full-width" type="submit">
            {{ 'RESET.SUBMIT' | translate }}
          </button>

          <p class="hint" *ngIf="error">{{ error }}</p>
        </form>

        <div *ngIf="completed">
          <p class="success-text">
            {{ 'RESET.SUCCESS' | translate }}
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

      .success-text {
        font-size: 14px;
        color: #047857;
        margin: 12px 0 16px;
      }
    `,
  ],
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  error = '';
  completed = false;
  private token: string | null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  submit() {
    this.error = '';

    if (!this.token) {
      this.error = this.translate.instant('RESET.INVALID_LINK');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = this.translate.instant('RESET.MISMATCH');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.completed = true;
      },
      error: () => {
        this.error = this.translate.instant('RESET.FAILED');
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

