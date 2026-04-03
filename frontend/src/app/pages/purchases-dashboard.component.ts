import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { CsvUploadComponent } from '../components/csv-upload.component';
import { ApiService } from '../services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-purchases-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CsvUploadComponent, NgChartsModule, TranslateModule],
  template: `
    <div class="page-header">
      <h1>📦 {{ 'NAV.PURCHASES' | translate }} Dashboard</h1>
      <p class="page-subtitle">{{ 'PURCHASES.SUBTITLE' | translate }}</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid" *ngIf="kpis">
      <div class="kpi-card">
        <span class="kpi-icon">💰</span>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.totalPurchases | number:'1.2-2' }}</span>
          <span class="kpi-label">{{ 'PURCHASES.TOTAL_PURCHASES' | translate }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-icon">📋</span>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.count }}</span>
          <span class="kpi-label">{{ 'PURCHASES.TOTAL_ORDERS' | translate }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-icon">📊</span>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.avgPurchaseValue | number:'1.2-2' }}</span>
          <span class="kpi-label">{{ 'PURCHASES.AVG_PURCHASE' | translate }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <span class="kpi-icon">🏭</span>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.uniqueSuppliers }}</span>
          <span class="kpi-label">{{ 'PURCHASES.UNIQUE_SUPPLIERS' | translate }}</span>
        </div>
      </div>
      <div class="kpi-card accent">
        <span class="kpi-icon">⭐</span>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.topSupplier }}</span>
          <span class="kpi-label">{{ 'PURCHASES.TOP_SUPPLIER' | translate }}</span>
        </div>
      </div>
    </div>

    <!-- 🚨 AI SECTION: Inventory Alerts & Reorder Recommendations -->
    <div class="card ai-section" *ngIf="stockoutRisks.length > 0">
      <div class="ai-header">
        <div>
          <h2>🚨 {{ 'PURCHASES.ALERTS' | translate }}</h2>
          <p class="ai-subtitle">{{ 'PURCHASES.ALERTS_SUBTITLE' | translate }}</p>
        </div>
        <span class="ai-badge">🧠 AI</span>
      </div>

      <div class="alert-grid">
        <div class="alert-card" *ngFor="let item of stockoutRisks"
             [class.risk-high]="item.risk === 'High'"
             [class.risk-medium]="item.risk === 'Medium'"
             [class.risk-low]="item.risk === 'Low'">
          <div class="alert-top">
            <span class="product-name">{{ item.product }}</span>
            <span class="risk-badge" [class.high]="item.risk === 'High'"
                  [class.medium]="item.risk === 'Medium'" [class.low]="item.risk === 'Low'">
              {{ 'ML.PURCHASES.RISK_' + item.risk.toUpperCase() | translate }} {{ 'PURCHASES.RISK' | translate }}
            </span>
          </div>
          <div class="alert-metrics">
            <div class="metric">
              <span class="metric-val">{{ item.estimatedStock }}</span>
              <span class="metric-lbl">{{ 'PURCHASES.EST_STOCK' | translate }}</span>
            </div>
            <div class="metric">
              <span class="metric-val">{{ item.dailySalesVelocity }}/day</span>
              <span class="metric-lbl">{{ 'PURCHASES.SALES_RATE' | translate }}</span>
            </div>
            <div class="metric">
              <span class="metric-val" [class.danger-text]="item.daysUntilStockout < 7">
                {{ item.daysUntilStockout < 999 ? (item.daysUntilStockout | number:'1.0-0') + ' ' + ('PURCHASES.DAYS' | translate) : '∞' }}
              </span>
              <span class="metric-lbl">{{ 'PURCHASES.UNTIL_STOCKOUT' | translate }}</span>
            </div>
          </div>
          <div class="reorder-box" *ngIf="item.reorderQty > 0">
            <div class="reorder-header">
              <span class="reorder-icon" *ngIf="item.urgency === 'Urgent'">🔴</span>
              <span class="reorder-icon" *ngIf="item.urgency === 'Soon'">🟡</span>
              <strong>{{ 'PURCHASES.REORDER_UNITS' | translate:{ units: item.reorderQty } }}</strong>
              <span class="urgency" [class.urgent]="item.urgency === 'Urgent'">{{ 'COMMON.' + item.urgency.toUpperCase() | translate }}</span>
            </div>
            <p class="reorder-reason">
              <ng-container [ngSwitch]="item.urgency">
                <ng-container *ngSwitchCase="'Urgent'">{{ 'ML.PURCHASES.EXP_URGENT' | translate:{ rate: item.dailySalesVelocity, days: item.daysUntilStockout | number:'1.0-0', qty: item.reorderQty } }}</ng-container>
                <ng-container *ngSwitchCase="'Soon'">{{ 'ML.PURCHASES.EXP_SOON' | translate:{ rate: item.dailySalesVelocity, qty: item.reorderQty } }}</ng-container>
                <ng-container *ngSwitchDefault>{{ item.explanation }}</ng-container>
              </ng-container>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="card ai-empty" *ngIf="stockoutRisks.length === 0 && kpis && kpis.count > 0 && !aiLoading">
      <span class="ai-empty-icon">✅</span>
      <p>{{ 'PURCHASES.NO_RISKS' | translate }}</p>
    </div>

    <div class="card ai-loading" *ngIf="aiLoading">
      <div class="spinner-sm"></div>
      <p>{{ 'PURCHASES.ANALYZING' | translate }}</p>
    </div>

    <!-- Upload + Manual Entry Row -->
    <div class="grid grid-2">
      <div class="card">
        <div class="card-icon">📤</div>
        <h2>{{ 'PURCHASES.UPLOAD_CSV' | translate }}</h2>
        <app-csv-upload (fileSelected)="upload($event)"></app-csv-upload>
        <div *ngIf="uploadMsg" class="status-msg" [class.error]="uploadError">{{ uploadMsg }}</div>
        <div *ngIf="uploadErrors.length" class="validation-errors">
          <p *ngFor="let e of uploadErrors" class="val-err">⚠️ {{ e }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">✏️</div>
        <h2>{{ 'PURCHASES.ADD_MANUAL' | translate }}</h2>
        <form (ngSubmit)="addManual()" class="manual-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ 'COMMON.DATE' | translate }} *</label>
              <input type="date" [(ngModel)]="form.date" name="date" required />
            </div>
            <div class="form-group">
              <label>{{ 'PURCHASES.SUPPLIER' | translate }} *</label>
              <input type="text" [(ngModel)]="form.supplier" name="supplier" placeholder="e.g. Acme Corp" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ 'PURCHASES.ITEM' | translate }} *</label>
              <input type="text" [(ngModel)]="form.item" name="item" placeholder="e.g. Office Paper A4" required />
            </div>
            <div class="form-group">
              <label>{{ 'PURCHASES.CATEGORY' | translate }}</label>
              <input type="text" [(ngModel)]="form.category" name="category" placeholder="e.g. Office Supplies" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ 'COMMON.QTY' | translate }} *</label>
              <input type="number" [(ngModel)]="form.quantity" name="quantity" min="1" required />
            </div>
            <div class="form-group">
              <label>{{ 'PURCHASES.UNIT_COST' | translate }} *</label>
              <input type="number" [(ngModel)]="form.unitCost" name="unitCost" step="0.01" min="0" required />
            </div>
          </div>
          <div class="form-group">
            <label>{{ 'PURCHASES.NOTES' | translate }}</label>
            <input type="text" [(ngModel)]="form.notes" name="notes" placeholder="Optional notes..." />
          </div>
          <button class="btn-submit" type="submit" [disabled]="manualLoading">
            {{ manualLoading ? '...' : '+ ' + ('PURCHASES.ADD_PURCHASE' | translate) }}
          </button>
          <div *ngIf="manualMsg" class="status-msg" [class.error]="manualError">{{ manualMsg }}</div>
        </form>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-2" *ngIf="kpis && kpis.count > 0">
      <div class="card">
        <h3>📈 {{ 'PURCHASES.PURCHASES_TIME' | translate }}</h3>
        <div class="chart-wrapper">
          <canvas baseChart [data]="lineChartData" type="line" [options]="lineChartOptions"></canvas>
        </div>
      </div>
      <div class="card">
        <h3>🏭 {{ 'PURCHASES.PURCHASES_SUPPLIER' | translate }}</h3>
        <div class="chart-wrapper">
          <canvas baseChart [data]="barChartData" type="bar" [options]="barChartOptions"></canvas>
        </div>
      </div>
    </div>
    <div class="grid grid-2" *ngIf="kpis && kpis.count > 0">
      <div class="card">
        <h3>🏷️ {{ 'PURCHASES.PURCHASES_CATEGORY' | translate }}</h3>
        <div class="chart-wrapper doughnut-wrapper">
          <canvas baseChart [data]="doughnutData" type="doughnut" [options]="doughnutOptions"></canvas>
        </div>
      </div>
      <div class="card" *ngIf="purchases.length > 0">
        <h3>📋 {{ 'PURCHASES.RECENT' | translate }}</h3>
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>{{ 'COMMON.DATE' | translate }}</th><th>{{ 'PURCHASES.SUPPLIER' | translate }}</th><th>{{ 'PURCHASES.ITEM' | translate }}</th><th>{{ 'PURCHASES.CATEGORY' | translate }}</th>
                <th>{{ 'COMMON.QTY' | translate }}</th><th>{{ 'PURCHASES.UNIT_COST' | translate }}</th><th>{{ 'COMMON.TOTAL' | translate }}</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of purchases">
                <td>{{ row.date | date:'yyyy-MM-dd' }}</td>
                <td>{{ row.supplier }}</td>
                <td>{{ row.item }}</td>
                <td><span class="type-badge" *ngIf="row.category">{{ row.category }}</span></td>
                <td>{{ row.quantity }}</td>
                <td>{{ row.unitCost | number:'1.2-2' }}</td>
                <td><strong>{{ row.totalCost | number:'1.2-2' }}</strong></td>
                <td><button class="btn-del" (click)="deletePurchase(row._id)">🗑️</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card empty-state" *ngIf="!loading && kpis && kpis.count === 0">
      <div class="empty-icon">📦</div>
      <h3>{{ 'PURCHASES.NO_PURCHASES' | translate }}</h3>
      <p>{{ 'PURCHASES.UPLOAD_HINT' | translate }}</p>
    </div>
    <div class="card loading-state" *ngIf="loading">
      <div class="spinner"></div>
      <p>{{ 'PURCHASES.LOADING' | translate }}</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 26px; font-weight: 800; color: var(--c-text); margin: 0 0 6px; }
    .page-subtitle { color: var(--c-text-muted); font-size: 14px; margin: 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card { display: flex; align-items: center; gap: 14px; background: var(--c-card); border-radius: 14px; padding: 18px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--c-card-border); transition: transform 0.2s, box-shadow 0.2s; }
    .kpi-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .kpi-card.accent { background: linear-gradient(135deg, var(--c-dark), var(--c-mid)); }
    .kpi-card.accent .kpi-value, .kpi-card.accent .kpi-label { color: white; }
    .kpi-icon { font-size: 28px; }
    .kpi-content { display: flex; flex-direction: column; }
    .kpi-value { font-size: 20px; font-weight: 800; color: var(--c-text); }
    .kpi-label { font-size: 11px; color: var(--c-text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .card-icon { font-size: 28px; margin-bottom: 4px; }
    .manual-form { display: flex; flex-direction: column; gap: 12px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-size: 11px; font-weight: 700; color: var(--c-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input { padding: 9px 12px; border: 1.5px solid var(--c-input-border); border-radius: 8px; font-size: 13px; font-family: inherit; color: var(--c-text); background: var(--c-input-bg); transition: border-color 0.2s; }
    .form-group input:focus { outline: none; border-color: var(--c-mid); box-shadow: 0 0 0 3px rgba(84,131,179,0.12); }
    .btn-submit { padding: 10px; border: none; border-radius: 8px; background: linear-gradient(135deg, #052659 0%, #5483B3 100%); color: white; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(5,38,89,0.25); }
    .btn-submit:hover:not(:disabled) { background: linear-gradient(135deg, #021024 0%, #052659 100%); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .status-msg { margin-top: 10px; padding: 10px 14px; background: #e9f7ef; color: #1e8449; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1px solid #a9dfbf; }
    .status-msg.error { background: #fce7e7; color: #c0392b; border-color: #f5b7b1; }
    .validation-errors { margin-top: 8px; } .val-err { font-size: 12px; color: #b7770d; margin: 4px 0; }
    .chart-wrapper { position: relative; height: 280px; }
    .doughnut-wrapper { height: 260px; max-width: 320px; margin: 0 auto; }
    .table-scroll { overflow-x: auto; }
    .type-badge { display: inline-block; padding: 2px 8px; border-radius: 6px; background: var(--c-hover-bg); color: var(--c-text); font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .btn-del { background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px 6px; border-radius: 6px; transition: background 0.2s; }
    .btn-del:hover { background: #fce7e7; }
    .empty-state { text-align: center; padding: 40px; }
    .empty-icon { font-size: 48px; margin-bottom: 10px; }
    .empty-state h3 { color: var(--c-text); margin-bottom: 8px; }
    .empty-state p { color: var(--c-text-muted); font-size: 14px; }
    .loading-state { text-align: center; padding: 40px; }
    .spinner { width: 36px; height: 36px; margin: 0 auto 12px; border: 3px solid #C1E8FF; border-top: 3px solid #052659; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ─── AI Section ─── */
    .ai-section { border: 1.5px solid var(--c-card-border); background: var(--c-card); }
    .ai-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
    .ai-header h2 { margin: 0 0 4px; font-size: 18px; color: var(--c-text); border: none !important; padding: 0 !important; }
    .ai-subtitle { color: var(--c-text-muted); font-size: 13px; margin: 0; }
    .ai-badge { background: linear-gradient(135deg, var(--c-dark), var(--c-mid)); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .alert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
    .alert-card { background: var(--c-card); border-radius: 12px; padding: 16px; border: 1px solid var(--c-card-border); transition: all 0.2s; }
    .alert-card:hover { box-shadow: var(--shadow-md); }
    .alert-card.risk-high { border-left: 4px solid #ef4444; }
    .alert-card.risk-medium { border-left: 4px solid #f59e0b; }
    .alert-card.risk-low { border-left: 4px solid #10b981; }
    .alert-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .product-name { font-weight: 700; font-size: 15px; color: var(--c-text); }
    .risk-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .risk-badge.high { background: #fce7e7; color: #c0392b; }
    .risk-badge.medium { background: #fef3cd; color: #b7770d; }
    .risk-badge.low { background: #e9f7ef; color: #1e8449; }
    .alert-metrics { display: flex; gap: 16px; margin-bottom: 10px; }
    .metric { display: flex; flex-direction: column; }
    .metric-val { font-size: 16px; font-weight: 800; color: var(--c-text); }
    .metric-lbl { font-size: 10px; color: var(--c-text-muted); text-transform: uppercase; font-weight: 600; }
    .danger-text { color: #ef4444 !important; }
    .reorder-box { background: var(--c-input-bg); border-radius: 8px; padding: 10px 14px; border: 1px solid var(--c-input-border); }
    .reorder-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .reorder-header strong { font-size: 13px; color: var(--c-text); }
    .reorder-icon { font-size: 14px; }
    .urgency { font-size: 11px; font-weight: 700; color: var(--c-text-muted); text-transform: uppercase; }
    .urgency.urgent { color: #c0392b; }
    .reorder-reason { font-size: 12px; color: var(--c-text-muted); margin: 0; line-height: 1.4; }
    .ai-empty { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: #e9f7ef; border: 1px solid #a9dfbf; }
    .ai-empty-icon { font-size: 24px; }
    .ai-empty p { margin: 0; color: #1e8449; font-weight: 500; font-size: 14px; }
    .ai-loading { display: flex; align-items: center; gap: 12px; padding: 16px 20px; }
    .spinner-sm { width: 20px; height: 20px; border: 2px solid var(--c-input-border); border-top: 2px solid var(--c-mid); border-radius: 50%; animation: spin 0.8s linear infinite; }
    .ai-loading p { margin: 0; color: var(--c-text-muted); font-size: 13px; }

    @media (max-width: 768px) {
      .page-header h1 { font-size: 20px; }
      .kpi-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
      .kpi-card { padding: 14px 16px; gap: 10px; }
      .kpi-icon { font-size: 22px; }
      .kpi-value { font-size: 17px; }
      .form-row { grid-template-columns: 1fr; }
      .chart-wrapper { height: 220px; }
      .alert-metrics { gap: 10px; }
      .metric-val { font-size: 14px; }
    }

    @media (max-width: 480px) {
      .kpi-grid { grid-template-columns: 1fr 1fr; }
      .kpi-card { flex-direction: column; text-align: center; }
      .alert-grid { grid-template-columns: 1fr; }
      .reorder-header { flex-direction: column; align-items: flex-start; }
    }
  `],
})
export class PurchasesDashboardComponent implements OnInit {
  loading = true;
  aiLoading = false;
  kpis: any = null;
  purchases: any[] = [];
  stockoutRisks: any[] = [];
  uploadMsg = ''; uploadError = false; uploadErrors: string[] = [];
  manualMsg = ''; manualError = false; manualLoading = false;
  form: any = { date: new Date().toISOString().slice(0, 10), supplier: '', item: '', category: '', quantity: 1, unitCost: 0, notes: '' };

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };
  doughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutOptions: ChartOptions<'doughnut'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };
  private chartColors = ['#052659', '#5483B3', '#7DA0CA', '#C1E8FF', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  constructor(private api: ApiService, private translate: TranslateService) { }

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading = true;
    this.api.getPurchaseKpis().subscribe({ next: (k) => { this.kpis = k; this.loading = false; }, error: () => { this.loading = false; } });
    this.api.getPurchases().subscribe((d) => (this.purchases = d));
    this.loadCharts();
    this.loadAi();
  }

  loadCharts() {
    this.api.getPurchasesOverTime('day').subscribe((data) => {
      this.lineChartData = { labels: data.map((d) => d._id), datasets: [{ data: data.map((d) => d.total), label: 'Spending', borderColor: '#052659', backgroundColor: 'rgba(84,131,179,0.15)', tension: 0.4, fill: true, pointBackgroundColor: '#052659' }] };
    });
    this.api.getPurchasesBySupplier().subscribe((data) => {
      this.barChartData = { labels: data.map((d) => d._id), datasets: [{ data: data.map((d) => d.total), label: 'Total', backgroundColor: data.map((_, i) => this.chartColors[i % this.chartColors.length]), borderRadius: 6 }] };
    });
    this.api.getPurchasesByCategory().subscribe((data) => {
      this.doughnutData = { labels: data.map((d) => d._id || 'Uncategorized'), datasets: [{ data: data.map((d) => d.total), backgroundColor: data.map((_, i) => this.chartColors[i % this.chartColors.length]) }] };
    });
  }

  loadAi() {
    this.aiLoading = true;
    this.api.getStockoutRisks().subscribe({
      next: (risks) => { this.stockoutRisks = risks; this.aiLoading = false; },
      error: () => { this.stockoutRisks = []; this.aiLoading = false; },
    });
  }

  upload(file: File) {
    this.uploadMsg = ''; this.uploadError = false; this.uploadErrors = [];
    this.api.uploadPurchases(file).subscribe({
      next: (res: any) => { this.uploadMsg = `✅ Imported ${res.imported} purchases`; this.uploadErrors = res.errors || []; this.loadAll(); },
      error: (err) => { this.uploadMsg = err?.error?.message || 'Upload failed'; this.uploadError = true; },
    });
  }

  addManual() {
    this.manualLoading = true; this.manualMsg = ''; this.manualError = false;
    this.api.createPurchase(this.form).subscribe({
      next: () => { this.manualMsg = '✅ Purchase added'; this.form = { date: new Date().toISOString().slice(0, 10), supplier: '', item: '', category: '', quantity: 1, unitCost: 0, notes: '' }; this.loadAll(); this.manualLoading = false; },
      error: (err) => { this.manualMsg = err?.error?.message || 'Failed'; this.manualError = true; this.manualLoading = false; },
    });
  }

  deletePurchase(id: string) {
    if (!confirm('Delete this purchase?')) return;
    this.api.deletePurchase(id).subscribe(() => this.loadAll());
  }
}
