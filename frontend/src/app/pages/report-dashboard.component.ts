import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="grid grid-3">
      <div class="card">
        <h3>{{ 'REPORT.REVENUE' | translate }}</h3>
        <p>{{ formatCurrency(kpis.revenue) }}</p>
      </div>
      <div class="card">
        <h3>{{ 'REPORT.COSTS' | translate }}</h3>
        <p>{{ formatCurrency(kpis.costs) }}</p>
      </div>
      <div class="card">
        <h3>{{ 'REPORT.PROFIT' | translate }}</h3>
        <p>{{ formatCurrency(kpis.profit) }}</p>
      </div>
      <div class="card">
        <h3>{{ 'REPORT.TAXES' | translate }}</h3>
        <p>{{ formatCurrency(kpis.taxes) }}</p>
      </div>
      <div class="card">
        <h3>{{ 'REPORT.REVENUE_GROWTH' | translate }}</h3>
        <p>{{ kpis.revenueGrowth?.toFixed(2) }}%</p>
      </div>
      <div class="card">
        <h3>{{ 'REPORT.VOLATILITY' | translate }}</h3>
        <p>{{ kpis.salesVolatility?.toFixed(2) }}%</p>
      </div>
    </div>

    <div class="card">
      <h2>{{ 'REPORT.COMPANY_HEALTH' | translate }}</h2>
      <div class="health">
        <div class="health-score">{{ reportAi.health_score || 0 }}</div>
        <div class="health-status">{{ reportAi.status || ( 'COMMON.N_A' | translate ) }}</div>
      </div>
      <p>{{ reportAi.main_reason || ( 'REPORT.NO_INSIGHT' | translate ) }}</p>
      <div class="gauge">
        <div class="gauge-fill" [style.width.%]="reportAi.health_score || 0"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .health {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .health-score {
        font-size: 32px;
        font-weight: 700;
      }

      .gauge {
        height: 10px;
        background: #e5e7eb;
        border-radius: 999px;
        overflow: hidden;
        margin-top: 12px;
      }

      .gauge-fill {
        height: 100%;
        background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444);
      }
    `,
  ],
})
export class ReportDashboardComponent implements OnInit {
  kpis: any = { currency: 'USD', revenue: 0, costs: 0, profit: 0, taxes: 0 };
  reportAi: any = {};

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getReportKpis().subscribe({
      next: (data) => {
        this.kpis = data;
        this.api.getReportAi().subscribe((ai) => (this.reportAi = ai?.payload || {}));
      },
      error: () => {
        this.api.getReportAi().subscribe((ai) => (this.reportAi = ai?.payload || {}));
      },
    });
  }

  formatCurrency(value: number) {
    return `${this.kpis.currency || 'USD'} ${Number(value || 0).toFixed(2)}`;
  }
}
