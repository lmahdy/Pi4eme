import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="signup-wrapper">
      <div class="signup-card">

        <div class="card-header">
          <img class="card-logo" src="assets/tenexa-logo.png" alt="Tenexa Logo" />
          <h2>{{ 'SIGNUP.TITLE' | translate }}</h2>
          <p>{{ 'SIGNUP.SUBTITLE' | translate }}</p>
        </div>

        <div *ngIf="submitted" class="success-box">
          ✅ Account created! Please check your email to verify your account before logging in.
        </div>

        <form *ngIf="!submitted" (ngSubmit)="submit()" novalidate>

          <!-- Name -->
          <div class="form-group">
            <label>{{ 'SIGNUP.NAME' | translate }}</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="John Doe"
              [class.input-error]="touched['name'] && nameError"
              (input)="touch('name')"
            />
            <span class="error-msg" *ngIf="touched['name'] && nameError">{{ nameError }}</span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>{{ 'SIGNUP.EMAIL' | translate }}</label>
            <input
              type="text"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="you@example.com"
              [class.input-error]="touched['email'] && emailError"
              (input)="touch('email')"
            />
            <span class="error-msg" *ngIf="touched['email'] && emailError">{{ emailError }}</span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>{{ 'SIGNUP.PASSWORD' | translate }}</label>
            <div class="input-wrap">
              <input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="Min. 8 characters"
                [class.input-error]="touched['password'] && passwordError"
                (input)="touch('password')"
              />
              <button type="button" class="eye-btn" (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span class="error-msg" *ngIf="touched['password'] && passwordError">{{ passwordError }}</span>
          </div>

          <!-- Role -->
          <div class="form-group">
            <label>{{ 'SIGNUP.ROLE' | translate }}</label>
            <div class="role-row">
              <label class="role-option">
                <input type="radio" name="role" [(ngModel)]="role" value="CompanyOwner" />
                <span>{{ 'SIGNUP.OWNER' | translate }}</span>
              </label>
              <label class="role-option">
                <input type="radio" name="role" [(ngModel)]="role" value="Accountant" />
                <span>{{ 'SIGNUP.ACCOUNTANT' | translate }}</span>
              </label>
            </div>
          </div>

          <!-- CompanyOwner fields -->
          <ng-container *ngIf="role === 'CompanyOwner'">
            <div class="form-group">
              <label>{{ 'SIGNUP.COMPANY_NAME' | translate }}</label>
              <input
                type="text"
                [(ngModel)]="companyName"
                name="companyName"
                required
                placeholder="Acme Corp"
                [class.input-error]="touched['companyName'] && companyNameError"
                (input)="touch('companyName')"
              />
              <span class="error-msg" *ngIf="touched['companyName'] && companyNameError">{{ companyNameError }}</span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ 'SIGNUP.TAX_RATE' | translate }}</label>
                <input type="number" [(ngModel)]="taxRate" name="taxRate" min="0" step="0.01" required placeholder="10" />
              </div>
              <div class="form-group">
                <label>{{ 'SIGNUP.CURRENCY' | translate }}</label>
                <input type="text" [(ngModel)]="currency" name="currency" required placeholder="USD" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ 'SIGNUP.NOTIF_EMAIL' | translate }} <span class="required-star">*</span></label>
              <input
                type="text"
                [(ngModel)]="notificationEmail"
                name="notificationEmail"
                required
                placeholder="alerts@yourcompany.com"
                [class.input-error]="touched['notificationEmail'] && notifEmailError"
                (input)="touch('notificationEmail')"
              />
              <span class="error-msg" *ngIf="touched['notificationEmail'] && notifEmailError">{{ notifEmailError }}</span>
            </div>
          </ng-container>

          <!-- Accountant fields -->
          <ng-container *ngIf="role === 'Accountant'">
            <div class="form-group">
              <label>{{ 'SIGNUP.COMPANY_ID' | translate }}</label>
              <input type="text" [(ngModel)]="companyId" name="companyId" required placeholder="COMP-XXXX" />
              <p class="hint">{{ 'SIGNUP.ID_HINT' | translate }}</p>
            </div>
          </ng-container>

          <!-- Validation summary -->
          <div class="validation-summary" *ngIf="submitAttempted && hasErrors()">
            ⚠️ Please fix the errors above before continuing.
          </div>

          <button class="btn-primary" type="submit" [disabled]="submitting">
            {{ submitting ? 'Creating account...' : ('SIGNUP.SUBMIT' | translate) }}
          </button>
          <p class="hint">
            {{ 'SIGNUP.ALREADY_HAVE' | translate }}
            <a routerLink="/login">{{ 'SIGNUP.LOGIN' | translate }}</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .signup-wrapper {
      min-height: calc(100vh - 64px);
      background: linear-gradient(145deg, #021024 0%, #052659 55%, #5483B3 100%);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 16px 60px;
    }
    .signup-card {
      max-width: 520px;
      width: 100%;
      background: var(--c-card);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(2,16,36,0.4), 0 0 0 1px var(--c-card-border);
    }
    .card-header { text-align: center; margin-bottom: 28px; }
    .card-logo {
      width: 56px; height: 56px; object-fit: contain;
      margin-bottom: 12px; border-radius: 12px;
      background: white; padding: 4px;
      box-shadow: 0 4px 16px rgba(2,16,36,0.15);
    }
    .card-header h2 { margin: 0 0 6px; font-size: 24px; font-weight: 800; color: var(--c-text); }
    .card-header p { margin: 0; font-size: 13.5px; color: var(--c-text-muted); }

    .success-box {
      background: #e9f7ef; border: 1px solid #a9dfbf;
      color: #1e8449; padding: 16px; border-radius: 10px;
      text-align: center; font-weight: 600; font-size: 14px; margin-bottom: 12px;
    }

    form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    label {
      font-size: 11.5px; font-weight: 700;
      color: var(--c-text-muted); letter-spacing: 0.6px; text-transform: uppercase;
    }
    .required-star { color: #ef4444; font-size: 13px; text-transform: none; }

    /* Password toggle */
    .input-wrap { position: relative; display: flex; align-items: center; }
    .eye-btn {
      position: absolute; right: 10px;
      background: none; border: none; cursor: pointer;
      font-size: 15px; line-height: 1; padding: 2px;
    }
    .input-wrap input { padding-right: 40px !important; }

    /* Inputs */
    input[type=text], input[type=password], input[type=number] {
      width: 100%; padding: 11px 14px;
      border-radius: 8px; border: 1.5px solid var(--c-input-border);
      font-size: 14px; font-family: inherit;
      color: var(--c-text); background: var(--c-input-bg);
      transition: all 0.18s ease; outline: none;
      box-sizing: border-box;
    }
    input:focus {
      border-color: var(--c-mid);
      background: var(--c-card);
      box-shadow: 0 0 0 3px rgba(84,131,179,0.15);
    }
    input.input-error { border-color: #ef4444; background: rgba(239,68,68,0.04); }
    input.input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }

    /* Error messages */
    .error-msg {
      font-size: 11.5px; color: #ef4444; font-weight: 600;
      display: flex; align-items: center; gap: 4px;
      animation: fadeIn 0.2s ease;
    }
    .error-msg::before { content: '⚠'; font-size: 11px; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Validation summary */
    .validation-summary {
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 8px; padding: 10px 14px;
      font-size: 13px; color: #ef4444; font-weight: 600;
    }

    /* Role selector */
    .role-row { display: flex; gap: 12px; }
    .role-option {
      display: flex; align-items: center; gap: 8px; padding: 10px 16px;
      border: 1.5px solid var(--c-input-border); border-radius: 8px;
      cursor: pointer; flex: 1; justify-content: center;
      background: var(--c-input-bg); transition: all 0.15s;
      font-size: 13px; font-weight: 500; color: var(--c-text-muted);
      text-transform: none; letter-spacing: normal;
    }
    .role-option:has(input:checked) {
      border-color: var(--c-mid); background: var(--c-hover-bg);
      color: var(--c-text); font-weight: 700;
    }
    .role-option input[type=radio] { accent-color: #052659; }

    .hint { font-size: 12.5px; color: var(--c-text-muted); margin: 0; }
    .hint a { color: var(--c-text); font-weight: 700; text-decoration: none; }
    .hint a:hover { text-decoration: underline; }

    /* Submit button */
    .btn-primary {
      width: 100%; padding: 13px 20px;
      background: linear-gradient(135deg, #052659 0%, #5483B3 100%);
      color: #fff; border: none; border-radius: 8px;
      font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 2px 10px rgba(5,38,89,0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #021024 0%, #052659 100%);
      box-shadow: 0 4px 16px rgba(5,38,89,0.4);
      transform: translateY(-1px);
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 480px) {
      .signup-card { padding: 30px 20px; }
      .card-header h2 { font-size: 20px; }
      .form-row { grid-template-columns: 1fr; }
      .role-row { flex-direction: column; }
      .btn-primary { font-size: 14px; padding: 11px 16px; }
    }
  `],
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  showPassword = false;
  role: 'CompanyOwner' | 'Accountant' = 'CompanyOwner';
  companyName = '';
  taxRate = 10;
  currency = 'USD';
  notificationEmail = '';
  companyId = '';
  submitted = false;
  submitting = false;
  submitAttempted = false;

  touched: Record<string, boolean> = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  touch(field: string) {
    this.touched[field] = true;
  }

  touchAll() {
    ['name', 'email', 'password', 'companyName', 'notificationEmail'].forEach(f => this.touched[f] = true);
  }

  // ── Validators ───────────────────────────────────────────────

  get nameError(): string {
    if (!this.name.trim()) return this.translate.instant('SIGNUP.ERRORS.NAME_REQ');
    if (this.name.trim().length < 2) return this.translate.instant('SIGNUP.ERRORS.NAME_MIN');
    if (!/[a-zA-ZÀ-ÿ]/.test(this.name)) return this.translate.instant('SIGNUP.ERRORS.NAME_ALPHA');
    return '';
  }

  get emailError(): string {
    if (!this.email.trim()) return this.translate.instant('SIGNUP.ERRORS.EMAIL_REQ');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(this.email)) return this.translate.instant('SIGNUP.ERRORS.EMAIL_INV');
    return '';
  }

  get passwordError(): string {
    if (!this.password) return this.translate.instant('SIGNUP.ERRORS.PASS_REQ');
    if (this.password.length < 8) return this.translate.instant('SIGNUP.ERRORS.PASS_MIN');
    return '';
  }

  get companyNameError(): string {
    if (this.role !== 'CompanyOwner') return '';
    if (!this.companyName.trim()) return this.translate.instant('SIGNUP.ERRORS.COMPANY_REQ');
    if (/^\d+$/.test(this.companyName.trim())) return this.translate.instant('SIGNUP.ERRORS.COMPANY_ALPHA');
    return '';
  }

  get notifEmailError(): string {
    if (this.role !== 'CompanyOwner') return '';
    if (!this.notificationEmail.trim()) return this.translate.instant('SIGNUP.ERRORS.NOTIF_REQ');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(this.notificationEmail)) return this.translate.instant('SIGNUP.ERRORS.NOTIF_INV');
    return '';
  }

  hasErrors(): boolean {
    if (this.nameError || this.emailError || this.passwordError) return true;
    if (this.role === 'CompanyOwner' && (this.companyNameError || this.notifEmailError)) return true;
    return false;
  }

  submit() {
    this.submitAttempted = true;
    this.touchAll();
    if (this.hasErrors()) return;

    this.submitting = true;
    this.authService
      .signup({
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        companyName: this.role === 'CompanyOwner' ? this.companyName : undefined,
        taxRate: this.role === 'CompanyOwner' ? this.taxRate : undefined,
        currency: this.role === 'CompanyOwner' ? this.currency : undefined,
        notificationEmail: this.role === 'CompanyOwner' ? this.notificationEmail : undefined,
        companyId: this.role === 'Accountant' ? this.companyId : undefined,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.submitted = true;
        },
        error: (err) => {
          this.submitting = false;
          alert(err?.error?.message || this.translate.instant('SIGNUP.FAILED'));
        },
      });
  }
}