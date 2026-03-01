import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  uploadSales(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiBase}/sales/upload`, formData);
  }

  uploadPurchases(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiBase}/purchases/upload`, formData);
  }

  getRevenueOverTime(interval: 'day' | 'month' = 'day') {
    return this.http.get<any[]>(`${this.apiBase}/sales/revenue-over-time?interval=${interval}`);
  }

  getRevenueByProduct() {
    return this.http.get<any[]>(`${this.apiBase}/sales/revenue-by-product`);
  }

  getPurchases() {
    return this.http.get<any[]>(`${this.apiBase}/purchases/list`);
  }

  getStock() {
    return this.http.get<any[]>(`${this.apiBase}/inventory/stock`);
  }

  getInventoryAlerts() {
    return this.http.get<any[]>(`${this.apiBase}/inventory/alerts`);
  }

  getReportKpis() {
    return this.http.get<any>(`${this.apiBase}/report/kpis?ts=${Date.now()}`);
  }

  getReportAi() {
    return this.http.get<any>(`${this.apiBase}/report/ai?ts=${Date.now()}`);
  }

  getAiInsights(module: string) {
    return this.http.get<any[]>(`${this.apiBase}/ai/insights?module=${module}&ts=${Date.now()}`);
  }

  triggerAgent() {
    return this.http.post(`${this.apiBase}/ai-agent/trigger`, {});
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.apiBase}/users`);
  }

  updateUserStatus(userId: string, status: 'active' | 'inactive') {
    return this.http.patch(`${this.apiBase}/users/${userId}/status`, { status });
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiBase}/users/${userId}`);
  }
}
