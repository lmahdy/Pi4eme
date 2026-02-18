import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="card signup-card">
      <h2>Create Account</h2>
      <p>Choose role, set credentials, and (for owners) define company defaults.</p>

      <form (ngSubmit)="submit()">
        <label>Email</label>
        <input type="email" [(ngModel)]="email" name="email" required />

        <label>Password</label>
        <input type="password" [(ngModel)]="password" name="password" minlength="8" required />

        <label>Role</label>
        <div class="role-row">
          <label><input type="radio" name="role" [(ngModel)]="role" value="CompanyOwner" /> Company Owner</label>
          <label><input type="radio" name="role" [(ngModel)]="role" value="Accountant" /> Accountant</label>
        </div>

        <ng-container *ngIf="role === 'CompanyOwner'">
          <label>Company Name</label>
          <input type="text" [(ngModel)]="companyName" name="companyName" required />

          <label>Tax Rate (%)</label>
          <input type="number" [(ngModel)]="taxRate" name="taxRate" min="0" step="0.01" required />

          <label>Currency (e.g. USD)</label>
          <input type="text" [(ngModel)]="currency" name="currency" required />

          <label>Notification Email</label>
          <input type="email" [(ngModel)]="notificationEmail" name="notificationEmail" />
        </ng-container>

        <ng-container *ngIf="role === 'Accountant'">
          <label>Existing Company ID</label>
          <input type="text" [(ngModel)]="companyId" name="companyId" required />
          <p class="hint">Ask the owner for the company ID (see their /company/config response).</p>
        </ng-container>

        <button class="button" type="submit">Sign Up</button>
        <p class="hint">Already have an account? <a routerLink="/login">Login</a></p>
      </form>
    </div>
  `,
  styles: [
    `
      .signup-card { max-width: 520px; margin: 40px auto; }
      form { display: flex; flex-direction: column; gap: 10px; }
      input { padding: 8px; border-radius: 6px; border: 1px solid #d1d5db; }
      .role-row { display: flex; gap: 12px; }
      .hint { font-size: 12px; color: #6b7280; }
    `,
  ],
})
export class SignupComponent {
  email = '';
  password = '';
  role: 'CompanyOwner' | 'Accountant' = 'CompanyOwner';
  companyName = '';
  taxRate = 10;
  currency = 'USD';
  notificationEmail = '';
  companyId = '';

  constructor(private authService: AuthService, private router: Router) { }

  submit() {
    this.authService
      .signup({
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
        error: (err) => alert(err?.error?.message || 'Signup failed'),
      });
  }
}
