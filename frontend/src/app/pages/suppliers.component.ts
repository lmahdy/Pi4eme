import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../services/api.service';

type SupplierProfile = {
  name: string;
  email?: string;
  phone?: string;
};

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="page-header">
      <h1>{{ 'SUPPLIERS.TITLE' | translate }}</h1>
      <p class="page-subtitle">{{ 'SUPPLIERS.SUBTITLE' | translate }}</p>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <input
          class="search"
          type="text"
          [(ngModel)]="search"
          [placeholder]="'SUPPLIERS.SEARCH' | translate"
        />
        <div class="list">
          <button
            class="list-item"
            *ngFor="let s of filteredSuppliers()"
            [class.active]="selectedName === s"
            (click)="selectSupplier(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <div class="card" *ngIf="selectedName">
        <h3>{{ selectedName }}</h3>
        <div class="detail-row"><span>{{ 'SUPPLIERS.EMAIL' | translate }}</span><strong>{{ currentProfile?.email || ('COMMON.N_A' | translate) }}</strong></div>
        <div class="detail-row"><span>{{ 'SUPPLIERS.PHONE' | translate }}</span><strong>{{ currentProfile?.phone || ('COMMON.N_A' | translate) }}</strong></div>
        <div class="detail-row"><span>{{ 'SUPPLIERS.ORDERS' | translate }}</span><strong>{{ supplierOrders }}</strong></div>
        <div class="detail-row"><span>{{ 'SUPPLIERS.TOTAL_SPEND' | translate }}</span><strong>{{ supplierSpend | number:'1.2-2' }}</strong></div>
      </div>
    </div>

    <div class="card">
      <h3>{{ 'SUPPLIERS.ADD_TITLE' | translate }}</h3>
      <div class="form-grid">
        <div>
          <input type="text" [(ngModel)]="newSupplier.name" [placeholder]="'SUPPLIERS.NAME' | translate" [class.error]="errors.name" />
          <span class="error-text" *ngIf="errors.name">{{ errors.name }}</span>
        </div>
        <div>
          <input type="email" [(ngModel)]="newSupplier.email" [placeholder]="'SUPPLIERS.EMAIL' | translate" [class.error]="errors.email" />
          <span class="error-text" *ngIf="errors.email">{{ errors.email }}</span>
        </div>
        <div>
          <input type="text" [(ngModel)]="newSupplier.phone" [placeholder]="'SUPPLIERS.PHONE' | translate" [class.error]="errors.phone" />
          <span class="error-text" *ngIf="errors.phone">{{ errors.phone }}</span>
        </div>
      </div>
      <button class="btn-primary" (click)="addSupplier()">{{ 'SUPPLIERS.ADD_BUTTON' | translate }}</button>
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
export class SuppliersComponent implements OnInit {
  purchases: any[] = [];
  search = '';
  selectedName = '';

  supplierOrders = 0;
  supplierSpend = 0;

  customProfiles: Record<string, SupplierProfile> = {};
  newSupplier: SupplierProfile = { name: '', email: '', phone: '' };
  errors: { name?: string; email?: string; phone?: string } = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProfiles();
    this.api.getPurchases().subscribe((rows) => {
      this.purchases = rows || [];
      const list = this.filteredSuppliers();
      if (!this.selectedName && list.length) this.selectSupplier(list[0]);
    });
  }

  loadProfiles() {
    try {
      this.customProfiles = JSON.parse(localStorage.getItem('suppliers_profiles') || '{}');
    } catch {
      this.customProfiles = {};
    }
  }

  saveProfiles() {
    localStorage.setItem('suppliers_profiles', JSON.stringify(this.customProfiles));
  }

  validateSupplier(): boolean {
    this.errors = {};
    const name = (this.newSupplier.name || '').trim();
    const email = (this.newSupplier.email || '').trim();
    const phone = (this.newSupplier.phone || '').trim();

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

  filteredSuppliers(): string[] {
    const fromPurchases = this.purchases
      .map((p) => (p?.supplier || '').toString().trim())
      .filter((x) => !!x);
    const names = Array.from(new Set([...fromPurchases, ...Object.keys(this.customProfiles)]));
    const q = this.search.trim().toLowerCase();
    return names
      .filter((n) => (q ? n.toLowerCase().includes(q) : true))
      .sort((a, b) => a.localeCompare(b));
  }

  selectSupplier(name: string) {
    this.selectedName = name;
    const rows = this.purchases.filter((p) => (p?.supplier || '').toString().trim() === name);
    this.supplierOrders = rows.length;
    this.supplierSpend = rows.reduce((sum, r) => sum + Number(r?.totalCost || 0), 0);
  }

  get currentProfile(): SupplierProfile | null {
    if (!this.selectedName) return null;
    return this.customProfiles[this.selectedName] || { name: this.selectedName };
  }

  addSupplier() {
    if (!this.validateSupplier()) return;
    const name = (this.newSupplier.name || '').trim();
    this.customProfiles[name] = {
      name,
      email: (this.newSupplier.email || '').trim(),
      phone: (this.newSupplier.phone || '').trim(),
    };
    this.saveProfiles();
    this.selectSupplier(name);
    this.newSupplier = { name: '', email: '', phone: '' };
  }
}

