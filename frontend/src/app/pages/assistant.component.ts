import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="card">
      <h2>{{ 'ASSISTANT.TITLE' | translate }}</h2>
      <p>{{ 'ASSISTANT.SUBTITLE' | translate }}</p>
      <button class="button" (click)="trigger()">{{ 'ASSISTANT.SEND_EMAIL' | translate }}</button>
      <p *ngIf="message">{{ message }}</p>
    </div>

    <div class="grid grid-3">
      <div class="card">
        <h3>{{ 'ASSISTANT.SALES_INSIGHT' | translate }}</h3>
        <p>{{ 'ASSISTANT.BEST' | translate }}: {{ salesInsight.best_product || ( 'COMMON.N_A' | translate ) }}</p>
        <p>{{ 'ASSISTANT.WORST' | translate }}: {{ salesInsight.worst_product || ( 'COMMON.N_A' | translate ) }}</p>
      </div>
      <div class="card">
        <h3>{{ 'ASSISTANT.INVENTORY_INSIGHT' | translate }}</h3>
        <p>{{ 'COMMON.ITEM' | translate }}: {{ inventoryInsight.item || ( 'COMMON.N_A' | translate ) }}</p>
        <p>{{ 'ASSISTANT.RISK' | translate }}: {{ inventoryInsight.risk_level || ( 'COMMON.N_A' | translate ) }}</p>
        <p>{{ 'ASSISTANT.REORDER' | translate }}: {{ inventoryInsight.recommended_reorder ?? ( 'COMMON.N_A' | translate ) }}</p>
      </div>
      <div class="card">
        <h3>{{ 'ASSISTANT.HEALTH_INSIGHT' | translate }}</h3>
        <p>{{ 'ASSISTANT.SCORE' | translate }}: {{ reportInsight.health_score ?? ( 'COMMON.N_A' | translate ) }}</p>
        <p>{{ 'ASSISTANT.STATUS' | translate }}: {{ reportInsight.status || ( 'COMMON.N_A' | translate ) }}</p>
      </div>
    </div>
  `,
})
export class AssistantComponent implements OnInit {
  message = '';
  salesInsight: any = {};
  inventoryInsight: any = {};
  reportInsight: any = {};

  constructor(private api: ApiService, private translate: TranslateService) { }

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
      next: () => (this.message = this.translate.instant('ASSISTANT.SUCCESS')),
      error: () => (this.message = this.translate.instant('ASSISTANT.FAILED')),
    });
  }
}
