import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { CsvUploadComponent } from '../components/csv-upload.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule, CsvUploadComponent, NgChartsModule],
  template: `
    <div class="grid grid-2">
      <div class="card">
        <h2>Upload Sales CSV</h2>
        <app-csv-upload (fileSelected)="upload($event)"></app-csv-upload>
        <p *ngIf="message">{{ message }}</p>
      </div>
      <div class="card">
        <h2>AI Insights</h2>
        <p><strong>Best Product:</strong> {{ bestProduct }}</p>
        <p><strong>Worst Product:</strong> {{ worstProduct }}</p>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3>Revenue Over Time</h3>
        <canvas baseChart [data]="lineChartData" chartType="line"></canvas>
      </div>
      <div class="card">
        <h3>Revenue By Product</h3>
        <canvas baseChart [data]="barChartData" chartType="bar"></canvas>
      </div>
    </div>
  `,
})
export class SalesDashboardComponent implements OnInit {
  message = '';
  bestProduct = 'N/A';
  worstProduct = 'N/A';

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{ data: [], label: 'Revenue', borderColor: '#2563eb', backgroundColor: '#93c5fd' }],
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Revenue', backgroundColor: '#10b981' }],
  };

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadCharts();
    this.loadInsights();
  }

  upload(file: File) {
    this.api.uploadSales(file).subscribe({
      next: () => {
        this.message = 'Sales CSV uploaded successfully.';
        this.loadCharts();
        this.loadInsights();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Upload failed.';
      },
    });
  }

  loadCharts() {
    this.api.getRevenueOverTime('day').subscribe((data) => {
      this.lineChartData.labels = data.map((item) => item._id);
      this.lineChartData.datasets[0].data = data.map((item) => item.revenue);
    });

    this.api.getRevenueByProduct().subscribe((data) => {
      this.barChartData.labels = data.map((item) => item._id);
      this.barChartData.datasets[0].data = data.map((item) => item.revenue);
    });
  }

  loadInsights() {
    this.api.getAiInsights('sales').subscribe((insights) => {
      const latest = insights?.[0]?.payload;
      if (latest) {
        this.bestProduct = latest.best_product || 'N/A';
        this.worstProduct = latest.worst_product || 'N/A';
      }
    });
  }
}
