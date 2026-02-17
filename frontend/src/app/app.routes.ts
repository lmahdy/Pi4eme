import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';
import { SalesDashboardComponent } from './pages/sales-dashboard.component';
import { PurchasesDashboardComponent } from './pages/purchases-dashboard.component';
import { ReportDashboardComponent } from './pages/report-dashboard.component';
import { AssistantComponent } from './pages/assistant.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'sales', component: SalesDashboardComponent },
  { path: 'purchases', component: PurchasesDashboardComponent },
  { path: 'report', component: ReportDashboardComponent },
  { path: 'assistant', component: AssistantComponent },
];
