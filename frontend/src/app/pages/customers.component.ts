import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';

type CustomerProfile = {
  name: string;
  email?: string;
  phone?: string;
};

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <h1>{{ 'CUSTOMERS.TITLE' | translate }}</h1>
      <p class="page-subtitle">{{ 'CUSTOMERS.SUBTITLE' | translate }}</p>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <input
          class="search"
          type="text"
          [(ngModel)]="search"
          [placeholder]="'CUSTOMERS.SEARCH' | translate"
        />
        <div class="list">
          <button
            class="list-item"
            *ngFor="let c of filteredCustomers()"
            [class.active]="selectedName === c"
            (click)="selectCustomer(c)"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <div class="card" *ngIf="selectedName">
        <h3>{{ selectedName }}</h3>
        <div class="detail-row"><span>{{ 'CUSTOMERS.EMAIL' | translate }}</span><strong>{{ currentProfile?.email || ('COMMON.N_A' | translate) }}</strong></div>
        <div class="detail-row"><span>{{ 'CUSTOMERS.PHONE' | translate }}</span><strong>{{ currentProfile?.phone || ('COMMON.N_A' | translate) }}</strong></div>
        <div class="detail-row"><span>{{ 'CUSTOMERS.ORDERS' | translate }}</span><strong>{{ customerOrders }}</strong></div>
        <div class="detail-row"><span>{{ 'CUSTOMERS.TOTAL_REVENUE' | translate }}</span><strong>{{ customerRevenue | number:'1.2-2' }}</strong></div>
      </div>
    </div>

    <div class="card">
      <h3>{{ 'CUSTOMERS.ADD_TITLE' | translate }}</h3>
      <div class="form-grid">
        <div>
          <input type="text" [(ngModel)]="newCustomer.name" [placeholder]="'CUSTOMERS.NAME' | translate" [class.error]="errors.name" />
          <span class="error-text" *ngIf="errors.name">{{ errors.name }}</span>
        </div>
        <div>
          <input type="email" [(ngModel)]="newCustomer.email" [placeholder]="'CUSTOMERS.EMAIL' | translate" [class.error]="errors.email" />
          <span class="error-text" *ngIf="errors.email">{{ errors.email }}</span>
        </div>
        <div>
          <input type="text" [(ngModel)]="newCustomer.phone" [placeholder]="'CUSTOMERS.PHONE' | translate" [class.error]="errors.phone" />
          <span class="error-text" *ngIf="errors.phone">{{ errors.phone }}</span>
        </div>
      </div>
      <button class="btn-primary" (click)="addCustomer()">{{ 'CUSTOMERS.ADD_BUTTON' | translate }}</button>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-header h1 { margin: 0 0 6px; color: #021024; }
    .page-subtitle { margin: 0; color: #5483B3; }
    .search { width: 100%; margin-bottom: 10px; padding: 10px; border: 1px solid #c1e8ff; border-radius: 8px; }
    .list { display: grid; gap: 8px; max-height: 360px; overflow: auto; }
    .list-item { text-align: left; border: 1px solid #c1e8ff; background: #fff; border-radius: 8px; padding: 10px; cursor: pointer; }
    .list-item.active { background: #f0f6ff; border-color: #5483B3; }
    .detail-row { display: flex; justify-content: space-between; margin: 8px 0; color: #052659; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 10px; }
    .form-grid > div { display: flex; flex-direction: column; }
    .form-grid input { padding: 10px; border: 1px solid #c1e8ff; border-radius: 8px; }
    .form-grid input.error { border-color: #dc3545; }
    .error-text { color: #dc3545; font-size: 12px; display: block; margin-top: 4px; }
    .btn-primary { padding: 10px 14px; border: none; border-radius: 8px; color: #fff; cursor: pointer; background: linear-gradient(135deg, #052659, #5483B3); }
  `],
})
export class CustomersComponent implements OnInit {
  sales: any[] = [];
  search = '';
  selectedName = '';

  customerOrders = 0;
  customerRevenue = 0;

  customProfiles: Record<string, CustomerProfile> = {};
  newCustomer: CustomerProfile = { name: '', email: '', phone: '' };
  errors: { name?: string; email?: string; phone?: string } = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProfiles();
    this.removeAzizFromCustomers();
    this.api.getSales().subscribe((rows) => {
      this.sales = rows || [];
      const list = this.filteredCustomers();
      if (!this.selectedName && list.length) this.selectCustomer(list[0]);
    });
  }

  loadProfiles() {
    try {
      this.customProfiles = JSON.parse(localStorage.getItem('customers_profiles') || '{}');
    } catch {
      this.customProfiles = {};
    }
  }

  removeAzizFromCustomers() {
    if (this.customProfiles['aziz']) {
      delete this.customProfiles['aziz'];
      this.saveProfiles();
    }
    this.api.deleteSalesByCustomer('aziz').subscribe();
  }

  saveProfiles() {
    localStorage.setItem('customers_profiles', JSON.stringify(this.customProfiles));
  }

  validateCustomer(): boolean {
    this.errors = {};
    const name = (this.newCustomer.name || '').trim();
    const email = (this.newCustomer.email || '').trim();
    const phone = (this.newCustomer.phone || '').trim();

    if (!name) {
      this.errors.name = 'Name is required';
    } else if (name.length < 2) {
      this.errors.name = 'Name must be at least 2 characters';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errors.email = 'Invalid email format';
    }

    if (phone && !/^[\d\s\-+()]{8,}$/.test(phone)) {
      this.errors.phone = 'Invalid phone format';
    }

    return Object.keys(this.errors).length === 0;
  }

  filteredCustomers(): string[] {
    const fromSales = this.sales
      .map((s) => (s?.customer || '').toString().trim())
      .filter((x) => !!x && x.toLowerCase() !== 'aziz');
    const names = Array.from(new Set([...fromSales, ...Object.keys(this.customProfiles)]));
    const q = this.search.trim().toLowerCase();
    return names
      .filter((n) => n.toLowerCase() !== 'aziz' && (q ? n.toLowerCase().includes(q) : true))
      .sort((a, b) => a.localeCompare(b));
  }

  selectCustomer(name: string) {
    this.selectedName = name;
    const rows = this.sales.filter((s) => (s?.customer || '').toString().trim() === name);
    this.customerOrders = rows.length;
    this.customerRevenue = rows.reduce((sum, r) => sum + Number(r?.totalAmount || 0), 0);
  }

  get currentProfile(): CustomerProfile | null {
    if (!this.selectedName) return null;
    return this.customProfiles[this.selectedName] || { name: this.selectedName };
  }

  addCustomer() {
    if (!this.validateCustomer()) return;
    const name = (this.newCustomer.name || '').trim();
    this.customProfiles[name] = {
      name,
      email: (this.newCustomer.email || '').trim(),
      phone: (this.newCustomer.phone || '').trim(),
    };
    this.saveProfiles();
    this.selectCustomer(name);
    this.newCustomer = { name: '', email: '', phone: '' };
  }
}

