import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsvUploadComponent } from '../components/csv-upload.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-purchases-dashboard',
  standalone: true,
  imports: [CommonModule, CsvUploadComponent],
  template: `
    <div class="grid grid-2">
      <div class="card">
        <h2>Upload Purchases CSV</h2>
        <app-csv-upload (fileSelected)="upload($event)"></app-csv-upload>
        <p *ngIf="message">{{ message }}</p>
      </div>
      <div class="card">
        <h2>Inventory Alerts</h2>
        <div *ngIf="alerts.length === 0">No high-risk inventory alerts.</div>
        <div *ngFor="let alert of alerts" class="alert">
          <span class="badge badge-high">High</span>
          {{ alert.item }} - stockout in {{ alert.predicted_stockout_days }} days
        </div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Recent Purchases</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Total</th>
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
        <h3>Stock Table</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Current Stock</th>
              <th>Updated</th>
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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  upload(file: File) {
    this.api.uploadPurchases(file).subscribe({
      next: () => {
        this.message = 'Purchases CSV uploaded successfully.';
        this.loadData();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Upload failed.';
      },
    });
  }

  loadData() {
    this.api.getPurchases().subscribe((data) => (this.purchases = data));
    this.api.getStock().subscribe((data) => (this.stock = data));
    this.api.getInventoryAlerts().subscribe((data) => (this.alerts = data));
  }
}
