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
          <picture>
            <source srcset="assets/tenexa-logo.webp" type="image/webp">
            <img class="card-logo" src="assets/tenexa-logo-opt.png" alt="Tenexa Logo" width="60" height="60" fetchpriority="high" />
          </picture>
          <h2>{{ 'AUTH.SIGNUP_TITLE' | translate }}</h2>
          <p>{{ 'AUTH.SIGNUP_SUB' | translate }}</p>
        </div>

        <div *ngIf="submitted" class="success-box">
          ✅ {{ 'AUTH.SIGNUP_SUCCESS' | translate }}
        </div>

        <form *ngIf="!submitted" (ngSubmit)="submit()" aria-label="Formulaire d'inscription" novalidate>
          <div class="form-group">
            <label for="signup-name">{{ 'AUTH.FULL_NAME' | translate }}</label>
            <input id="signup-name" type="text" [(ngModel)]="name" name="name" required aria-required="true"
              placeholder="John" autocomplete="name" [attr.aria-invalid]="name && !isValidName() ? 'true' : null" />
            <span class="error-msg" role="alert" *ngIf="name && !isValidName()">⚠️ {{ 'AUTH.ERR_NAME' | translate }}</span>
          </div>

          <div class="form-group">
            <label for="signup-email">{{ 'AUTH.EMAIL' | translate }}</label>
            <input id="signup-email" type="email" [(ngModel)]="email" name="email" required aria-required="true"
              placeholder="you@example.com" autocomplete="email" [attr.aria-invalid]="email && !isValidEmail() ? 'true' : null" />
            <span class="error-msg" role="alert" *ngIf="email && !isValidEmail()">⚠️ {{ 'AUTH.ERR_EMAIL' | translate }}</span>
          </div>

          <div class="form-group">
            <label for="signup-password">{{ 'AUTH.PASSWORD' | translate }}</label>
            <input id="signup-password" type="password" [(ngModel)]="password" name="password" minlength="8"
              required aria-required="true" placeholder="Min. 8 characters" autocomplete="new-password" />
          </div>

          <div class="form-group">
            <label id="role-label">{{ 'ADMIN.ROLE' | translate }}</label>
            <div class="role-row" role="radiogroup" aria-labelledby="role-label">
              <label class="role-option" for="role-owner">
                <input id="role-owner" type="radio" name="role" [(ngModel)]="role" value="CompanyOwner" />
                <span>{{ 'ADMIN.OWNER_ROLE' | translate }}</span>
              </label>
              <label class="role-option" for="role-accountant">
                <input id="role-accountant" type="radio" name="role" [(ngModel)]="role" value="Accountant" />
                <span>{{ 'ADMIN.ACCOUNTANT_ROLE' | translate }}</span>
              </label>
            </div>
          </div>

          <ng-container *ngIf="role === 'CompanyOwner'">
            <div class="form-group">
              <label for="signup-company">{{ 'AUTH.COMPANY_NAME' | translate }}</label>
              <input id="signup-company" type="text" [(ngModel)]="companyName" name="companyName" required aria-required="true"
                placeholder="Acme Corp" autocomplete="organization"
                [attr.aria-invalid]="companyName && !isValidCompanyName() ? 'true' : null" />
              <span class="error-msg" role="alert" *ngIf="companyName && !isValidCompanyName()">⚠️ {{ 'AUTH.ERR_COMPANY' | translate }}</span>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="signup-tax">{{ 'SETTINGS.TAX_RATE' | translate }}</label>
                <input id="signup-tax" type="number" [(ngModel)]="taxRate" name="taxRate" min="0"
                  step="0.01" required aria-required="true" placeholder="10" />
              </div>
              <div class="form-group">
                <label for="signup-currency">{{ 'SETTINGS.CURRENCY' | translate }}</label>
                <input id="signup-currency" type="text" [(ngModel)]="currency" name="currency"
                  required aria-required="true" placeholder="USD" autocomplete="transaction-currency" />
              </div>
            </div>
            <div class="form-group">
              <label for="signup-notif-email">{{ 'SETTINGS.NOTIF_EMAIL' | translate }}</label>
              <input id="signup-notif-email" type="email" [(ngModel)]="notificationEmail" name="notificationEmail"
                placeholder="alerts@yourcompany.com" autocomplete="email"
                [attr.aria-invalid]="notificationEmail && !isValidEmail(notificationEmail) ? 'true' : null" />
              <span class="error-msg" role="alert" *ngIf="notificationEmail && !isValidEmail(notificationEmail)">⚠️ {{ 'AUTH.ERR_EMAIL' | translate }}</span>
            </div>
          </ng-container>

          <ng-container *ngIf="role === 'Accountant'">
            <div class="form-group">
              <label for="signup-company-id">{{ 'ADMIN.COMPANY_ID' | translate }}</label>
              <input id="signup-company-id" type="text" [(ngModel)]="companyId" name="companyId"
                required aria-required="true" placeholder="COMP-XXXX" />
              <p class="hint">{{ 'AUTH.ASK_ID' | translate }}</p>
            </div>
          </ng-container>

          <button class="btn-primary" type="submit" [disabled]="submitting || !isFormValid()" [attr.aria-busy]="submitting">
            {{ submitting ? ('SETTINGS.SAVING' | translate) : ('AUTH.SIGNUP_BTN' | translate) }}
          </button>
          <p class="hint">
            {{ 'AUTH.HAVE_ACCOUNT' | translate }}
            <a routerLink="/login">{{ 'AUTH.SIGNIN_BTN' | translate }}</a>
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
      background: rgba(255,255,255,0.98);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(2,16,36,0.4), 0 0 0 1px rgba(84,131,179,0.15);
    }
    .card-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .card-logo {
      width: 56px; height: 56px;
      object-fit: contain;
      margin-bottom: 12px;
      border-radius: 12px;
      background: white;
      padding: 4px;
      box-shadow: 0 4px 16px rgba(2,16,36,0.15);
    }
    .card-header h2 {
      margin: 0 0 6px;
      font-size: 24px;
      font-weight: 800;
      color: #021024;
    }
    .card-header p {
      margin: 0;
      font-size: 13.5px;
      color: #5483B3;
    }
    .success-box {
      background: #e9f7ef; border: 1px solid #a9dfbf;
      color: #1e8449; padding: 16px;
      border-radius: 10px; text-align: center;
      font-weight: 600; font-size: 14px;
      margin-bottom: 12px;
    }
    form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    label {
      font-size: 11.5px; font-weight: 700;
      color: #5483B3; letter-spacing: 0.6px; text-transform: uppercase;
    }
    input[type=text], input[type=email], input[type=password], input[type=number] {
      width: 100%; padding: 11px 14px;
      border-radius: 8px; border: 1.5px solid #C1E8FF;
      font-size: 14px; font-family: inherit;
      color: #021024; background: #f9fdff;
      transition: transform, opacity, color, background-color, border-color, box-shadow 0.18s ease;
      outline: none;
    }
    input:focus {
      border-color: #5483B3;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(84,131,179,0.15);
    }
    .role-row { display: flex; gap: 12px; }
    .role-option {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px;
      border: 1.5px solid #C1E8FF; border-radius: 8px;
      cursor: pointer; flex: 1; justify-content: center;
      background: #f9fdff; transition: transform, opacity, color, background-color, border-color, box-shadow 0.15s;
      font-size: 13px; font-weight: 500;
      color: #5483B3;
      text-transform: none; letter-spacing: normal;
    }
    .role-option:has(input:checked) {
      border-color: #5483B3;
      background: #C1E8FF;
      color: #021024;
      font-weight: 700;
    }
    .role-option input[type=radio] { accent-color: #052659; }
    .hint { font-size: 12.5px; color: #5483B3; margin: 0; }
    .hint a { color: #052659; font-weight: 700; text-decoration: none; }
    .hint a:hover { text-decoration: underline; }
    .error-msg {
      font-size: 12px;
      color: #c0392b;
      margin-top: 4px;
      font-weight: 500;
      display: block;
    }
    .btn-primary {
      width: 100%; padding: 13px 20px;
      background: linear-gradient(135deg, #052659 0%, #5483B3 100%);
      color: #fff; border: none; border-radius: 8px;
      font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: transform, opacity, color, background-color, border-color, box-shadow 0.2s;
      box-shadow: 0 2px 10px rgba(5,38,89,0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #021024 0%, #052659 100%);
      box-shadow: 0 4px 16px rgba(5,38,89,0.4);
      transform: translateY(-1px);
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `],
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  role: 'CompanyOwner' | 'Accountant' = 'CompanyOwner';
  companyName = '';
  taxRate = 10;
  currency = 'USD';
  notificationEmail = '';
  companyId = '';
  submitted = false;
  submitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  // Validation: Name must have at least 2 letters and cannot be exactly two words
  isValidName(): boolean {
    if (!this.name || this.name.trim().length === 0) return false;
    
    // Check if it has at least 2 letters (filter out spaces)
    const letters = this.name.replace(/\s+/g, '').length;
    if (letters < 2) return false;
    
    // Check if it's only numbers (with spaces allowed)
    const onlyNumbers = /^\d+(\s+\d+)*$/.test(this.name.trim());
    if (onlyNumbers) return false;
    
    // Check that it's NOT exactly 2 words (allow 1 word or 3+ words)
    const words = this.name.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length !== 2;
  }

  // Validation: Email must contain @ and .
  isValidEmail(emailVal?: string): boolean {
    const val = emailVal || this.email;
    if (!val || val.trim().length === 0) return false;
    return val.includes('@') && val.includes('.');
  }

  // Validation: Company name cannot be only numbers
  isValidCompanyName(): boolean {
    if (!this.companyName || this.companyName.trim().length === 0) return false;
    
    // Check if it's only numbers (with spaces allowed)
    const onlyNumbers = /^\d+(\s+\d+)*$/.test(this.companyName.trim());
    return !onlyNumbers;
  }

  // Overall form validation
  isFormValid(): boolean {
    // Check basic fields
    if (!this.name || !this.email || !this.password || !this.role) return false;
    
    // Check field validations
    if (!this.isValidName() || !this.isValidEmail()) return false;
    
    // Check password minimum length
    if (this.password.length < 8) return false;
    
    // Company Owner specific validations
    if (this.role === 'CompanyOwner') {
      if (!this.companyName || !this.isValidCompanyName()) return false;
      if (this.taxRate < 0) return false;
      if (!this.currency) return false;
      
      // Notification email validation if provided
      if (this.notificationEmail && !this.isValidEmail(this.notificationEmail)) return false;
    }
    
    // Accountant specific validations
    if (this.role === 'Accountant') {
      if (!this.companyId) return false;
    }
    
    return true;
  }

  submit() {
    if (!this.isFormValid()) {
      alert(this.translate.instant('SIGNUP.VALIDATION_ERROR') || 'Please fill in all required fields correctly');
      return;
    }

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
        notificationEmail: this.role === 'CompanyOwner' ? this.notificationEmail || this.email : undefined,
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