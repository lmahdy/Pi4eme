import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="card">

        <!-- Icon -->
        <div class="icon-wrap">🔒</div>

        <h2>Forgot Password</h2>
        <p class="subtitle">Enter your account email and we'll send you a reset link.</p>

        <!-- Form -->
        <form *ngIf="!submitted" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email Address</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="you@example.com"
              [class.invalid]="error"
            />
            <p class="error-msg" *ngIf="error">{{ error }}</p>
          </div>

          <button class="btn-primary" type="submit" [disabled]="loading || !email">
            <span *ngIf="!loading">Send Reset Link</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>

          <a routerLink="/login" class="back-link">← Back to Login</a>
        </form>

        <!-- Success State -->
        <div *ngIf="submitted" class="success-state">
          <div class="success-icon">✅</div>
          <h3>Check your inbox</h3>
          <p>We've sent a password reset link to <strong>{{ email }}</strong>. It expires in 1 hour.</p>
          <p class="tip">If you don't see it, check your spam folder.</p>
          <a routerLink="/login" class="btn-primary" style="text-decoration: none; text-align: center;">Back to Login</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-wrapper {
      min-height: calc(100vh - 64px);
      background: linear-gradient(145deg, #021024 0%, #052659 55%, #5483B3 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 16px;
    }

    .card {
      max-width: 440px;
      width: 100%;
      background: var(--c-card);
      border-radius: 20px;
      padding: 44px 40px;
      box-shadow: 0 20px 60px rgba(2,16,36,0.4), 0 0 0 1px var(--c-card-border);
      text-align: center;
    }

    .icon-wrap {
      font-size: 52px;
      margin-bottom: 16px;
      line-height: 1;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 800;
      color: var(--c-text);
    }

    .subtitle {
      margin: 0 0 28px;
      font-size: 13.5px;
      color: var(--c-text-muted);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: left;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--c-text-muted);
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }

    input {
      width: 100%;
      padding: 11px 14px;
      border-radius: 8px;
      border: 1.5px solid var(--c-input-border);
      font-size: 14px;
      font-family: inherit;
      color: var(--c-text);
      background: var(--c-input-bg);
      transition: all 0.18s ease;
      outline: none;
      box-sizing: border-box;
    }
    input:focus {
      border-color: var(--c-mid);
      background: var(--c-card);
      box-shadow: 0 0 0 3px rgba(84,131,179,0.15);
    }
    input.invalid {
      border-color: #e53e3e;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 13px 20px;
      background: linear-gradient(135deg, #052659 0%, #5483B3 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 10px rgba(5,38,89,0.3);
      letter-spacing: 0.2px;
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #021024 0%, #052659 100%);
      box-shadow: 0 4px 16px rgba(5,38,89,0.4);
      transform: translateY(-1px);
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner {
      width: 18px; height: 18px;
      border: 3px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .back-link {
      text-align: center;
      font-size: 13px;
      color: var(--c-text-muted);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--c-text); }

    .error-msg {
      font-size: 12px;
      color: #c53030;
      margin: 0;
    }

    /* Success */
    .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .success-icon { font-size: 52px; line-height: 1; }
    .success-state h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: var(--c-text);
    }
    .success-state p {
      margin: 0;
      font-size: 13.5px;
      color: var(--c-text-muted);
      line-height: 1.6;
    }
    .success-state .tip {
      font-size: 12px;
      color: var(--c-text-muted);
    }

    @media (max-width: 480px) {
      .card { padding: 30px 20px; }
      h2 { font-size: 20px; }
      .icon-wrap { font-size: 40px; }
      .btn-primary { font-size: 14px; padding: 11px 16px; }
    }
  `],
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  submitted = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  submit() {
    this.error = '';
    if (!this.email) return;
    this.loading = true;

    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
      },
      error: () => {
        this.loading = false;
        // Always show success for security (don't reveal if email exists)
        this.submitted = true;
      },
    });
  }
}
