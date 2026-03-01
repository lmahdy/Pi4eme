import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvUploadComponent } from '../components/csv-upload.component';
import { ApiService } from '../services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-purchases-dashboard',
  standalone: true,
  imports: [CommonModule, CsvUploadComponent, TranslateModule],
  template: `
    <div class="grid grid-2">
      <div class="card">
        <h2>{{ 'PURCHASES.UPLOAD_CSV' | translate }}</h2>
        <app-csv-upload (fileSelected)="upload($event)"></app-csv-upload>
        <p *ngIf="message">{{ message }}</p>
      </div>
      <div class="card">
        <h2>{{ 'PURCHASES.ALERTS' | translate }}</h2>
        <div *ngIf="alerts.length === 0">{{ 'PURCHASES.NO_ALERTS' | translate }}</div>
        <div *ngFor="let alert of alerts" class="alert">
          <span class="badge badge-high">High</span>
          {{ alert.item }} - {{ 'PURCHASES.STOCKOUT_IN' | translate }} {{ alert.predicted_stockout_days }} {{ 'PURCHASES.DAYS' | translate }}
        </div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>{{ 'PURCHASES.RECENT' | translate }}</h3>
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'COMMON.DATE' | translate }}</th>
              <th>{{ 'COMMON.ITEM' | translate }}</th>
              <th>{{ 'COMMON.TYPE' | translate }}</th>
              <th>{{ 'COMMON.QTY' | translate }}</th>
              <th>{{ 'COMMON.TOTAL' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of purchases">
              <td>{{ row.date | date: 'yyyy-MM-dd' }}</td>
              <td>{{ row.item }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.totalCost }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>{{ 'PURCHASES.STOCK_TABLE' | translate }}</h3>
        <table class="table">
          <thead>
            <tr>
              <th>{{ 'COMMON.ITEM' | translate }}</th>
              <th>{{ 'PURCHASES.STOCK' | translate }}</th>
              <th>{{ 'PURCHASES.UPDATED' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of stock">
              <td>{{ row.item }}</td>
              <td>{{ row.currentStock }}</td>
              <td>{{ row.lastUpdated | date: 'yyyy-MM-dd' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .alert {
        margin-top: 8px;
      }
    `,
  ],
})
export class PurchasesDashboardComponent implements OnInit {
  message = '';
  purchases: any[] = [];
  stock: any[] = [];
  alerts: any[] = [];

  constructor(private api: ApiService, private translate: TranslateService) { }

  ngOnInit() {
    this.loadData();
  }

  upload(file: File) {
    this.api.uploadPurchases(file).subscribe({
      next: () => {
        this.message = this.translate.instant('PURCHASES.SUCCESS');
        this.loadData();
      },
      error: (err) => {
        this.message = err?.error?.message || this.translate.instant('SALES.FAILED');
      },
    });
  }

  loadData() {
    this.api.getPurchases().subscribe((data) => (this.purchases = data));
    this.api.getStock().subscribe((data) => (this.stock = data));
    this.api.getInventoryAlerts().subscribe((data) => (this.alerts = data));
  }
}
