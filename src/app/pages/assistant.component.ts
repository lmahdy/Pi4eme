import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>AI Business Assistant</h2>
      <p>Generate a full business summary and send it by email.</p>
      <button class="button" (click)="trigger()">Send Summary Email</button>
      <p *ngIf="message">{{ message }}</p>
    </div>

    <div class="grid grid-3">
      <div class="card">
        <h3>Sales Insight</h3>
        <p>Best: {{ salesInsight.best_product || 'N/A' }}</p>
        <p>Worst: {{ salesInsight.worst_product || 'N/A' }}</p>
      </div>
      <div class="card">
        <h3>Inventory Insight</h3>
        <p>Item: {{ inventoryInsight.item || 'N/A' }}</p>
        <p>Risk: {{ inventoryInsight.risk_level || 'N/A' }}</p>
        <p>Reorder: {{ inventoryInsight.recommended_reorder ?? 'N/A' }}</p>
      </div>
      <div class="card">
        <h3>Health Insight</h3>
        <p>Score: {{ reportInsight.health_score ?? 'N/A' }}</p>
        <p>Status: {{ reportInsight.status || 'N/A' }}</p>
      </div>
    </div>
  `,
})
export class AssistantComponent implements OnInit {
  message = '';
  salesInsight: any = {};
  inventoryInsight: any = {};
  reportInsight: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadInsights();
  }

  loadInsights() {
    this.api.getAiInsights('sales').subscribe((data) => (this.salesInsight = data?.[0]?.payload || {}));
    this.api
      .getAiInsights('inventory')
      .subscribe((data) => (this.inventoryInsight = data?.[0]?.payload || {}));
    // Trigger report ML via KPIs first, then fetch latest AI insight.
    this.api.getReportKpis().subscribe({
      next: () => {
        this.api.getReportAi().subscribe((data) => (this.reportInsight = data?.payload || {}));
      },
      error: () => {
        this.api.getReportAi().subscribe((data) => (this.reportInsight = data?.payload || {}));
      },
    });
  }

  trigger() {
    this.api.triggerAgent().subscribe({
      next: () => (this.message = 'Email sent successfully.'),
      error: () => (this.message = 'Failed to send email. Check SMTP configuration.'),
    });
  }
}
