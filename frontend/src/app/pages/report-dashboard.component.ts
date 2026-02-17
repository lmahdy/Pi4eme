import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-3">
      <div class="card">
        <h3>Revenue</h3>
        <p>{{ formatCurrency(kpis.revenue) }}</p>
      </div>
      <div class="card">
        <h3>Costs</h3>
        <p>{{ formatCurrency(kpis.costs) }}</p>
      </div>
      <div class="card">
        <h3>Profit</h3>
        <p>{{ formatCurrency(kpis.profit) }}</p>
      </div>
      <div class="card">
        <h3>Taxes</h3>
        <p>{{ formatCurrency(kpis.taxes) }}</p>
      </div>
      <div class="card">
        <h3>Revenue Growth</h3>
        <p>{{ kpis.revenueGrowth?.toFixed(2) }}%</p>
      </div>
      <div class="card">
        <h3>Sales Volatility</h3>
        <p>{{ kpis.salesVolatility?.toFixed(2) }}%</p>
      </div>
    </div>

    <div class="card">
      <h2>Company Health</h2>
      <div class="health">
        <div class="health-score">{{ reportAi.health_score || 0 }}</div>
        <div class="health-status">{{ reportAi.status || 'N/A' }}</div>
      </div>
      <p>{{ reportAi.main_reason || 'No insight yet.' }}</p>
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

  constructor(private api: ApiService) {}

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
