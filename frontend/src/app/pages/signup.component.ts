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
    <div class="auth-shell">
      <div class="card signup-card">
        <h2>{{ 'SIGNUP.TITLE' | translate }}</h2>
        <p class="subtitle">{{ 'SIGNUP.SUBTITLE' | translate }}</p>

        <form (ngSubmit)="submit()">
          <label>{{ 'SIGNUP.NAME' | translate }}</label>
          <input type="text" [(ngModel)]="name" name="name" required />

          <label>{{ 'SIGNUP.EMAIL' | translate }}</label>
          <input type="email" [(ngModel)]="email" name="email" required />

          <label>{{ 'SIGNUP.PASSWORD' | translate }}</label>
          <input type="password" [(ngModel)]="password" name="password" minlength="8" required />

          <label>{{ 'SIGNUP.ROLE' | translate }}</label>
          <div class="role-row">
            <label><input type="radio" name="role" [(ngModel)]="role" value="CompanyOwner" /> {{ 'SIGNUP.OWNER' | translate }}</label>
            <label><input type="radio" name="role" [(ngModel)]="role" value="Accountant" /> {{ 'SIGNUP.ACCOUNTANT' | translate }}</label>
          </div>

          <ng-container *ngIf="role === 'CompanyOwner'">
            <label>{{ 'SIGNUP.COMPANY_NAME' | translate }}</label>
            <input type="text" [(ngModel)]="companyName" name="companyName" required />

            <label>{{ 'SIGNUP.TAX_RATE' | translate }}</label>
            <input type="number" [(ngModel)]="taxRate" name="taxRate" min="0" step="0.01" required />

            <label>{{ 'SIGNUP.CURRENCY' | translate }}</label>
            <input type="text" [(ngModel)]="currency" name="currency" required />

            <label>{{ 'SIGNUP.NOTIF_EMAIL' | translate }}</label>
            <input type="email" [(ngModel)]="notificationEmail" name="notificationEmail" />
          </ng-container>

          <ng-container *ngIf="role === 'Accountant'">
            <label>{{ 'SIGNUP.COMPANY_ID' | translate }}</label>
            <input type="text" [(ngModel)]="companyId" name="companyId" required />
            <p class="hint">{{ 'SIGNUP.ID_HINT' | translate }}</p>
          </ng-container>

          <button class="button full-width" type="submit">{{ 'SIGNUP.SUBMIT' | translate }}</button>
          <p class="hint align-center">
            {{ 'SIGNUP.ALREADY_HAVE' | translate }} 
            <a routerLink="/login">{{ 'SIGNUP.LOGIN' | translate }}</a>
          </p>
        </form>
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

      .signup-card { max-width: 720px; width: 100%; padding: 28px 32px; }
      form { display: flex; flex-direction: column; gap: 10px; }
      input { padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 14px; }
      .role-row { display: flex; gap: 12px; }
      .hint { font-size: 12px; color: #6b7280; }
      .subtitle { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
      .full-width { width: 100%; margin-top: 4px; }
      .align-center { text-align: center; }
    `,
  ],
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { }

  submit() {
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
        next: () => this.router.navigate(['/sales']),
        error: (err) => alert(err?.error?.message || this.translate.instant('SIGNUP.FAILED')),
      });
  }
}
