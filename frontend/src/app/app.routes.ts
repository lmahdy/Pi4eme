import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';
import { SalesDashboardComponent } from './pages/sales-dashboard.component';
import { PurchasesDashboardComponent } from './pages/purchases-dashboard.component';
import { ReportDashboardComponent } from './pages/report-dashboard.component';
import { AssistantComponent } from './pages/assistant.component';

import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'sales', component: SalesDashboardComponent, canActivate: [authGuard] },
  { path: 'purchases', component: PurchasesDashboardComponent, canActivate: [authGuard] },
  { path: 'report', component: ReportDashboardComponent, canActivate: [authGuard] },
  { path: 'assistant', component: AssistantComponent, canActivate: [authGuard] },
];
