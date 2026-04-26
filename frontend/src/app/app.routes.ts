import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { rolesGuard } from './guards/roles.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ── Public routes ─────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup.component').then(m => m.SignupComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./pages/auth-callback.component').then(m => m.AuthCallbackComponent)
  },

  // ── Company Owner / Accountant routes ─────────────────────────
  {
    path: 'sales',
    loadComponent: () => import('./pages/sales-dashboard.component').then(m => m.SalesDashboardComponent),
    canActivate: [authGuard, rolesGuard(['CompanyOwner', 'Accountant'], '/admin')]
  },
  {
    path: 'purchases',
    loadComponent: () => import('./pages/purchases-dashboard.component').then(m => m.PurchasesDashboardComponent),
    canActivate: [authGuard, rolesGuard(['CompanyOwner', 'Accountant'], '/admin')]
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers-dashboard.component').then(m => m.CustomersDashboardComponent),
    canActivate: [authGuard, rolesGuard(['CompanyOwner', 'Accountant'], '/admin')]
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./pages/suppliers-dashboard.component').then(m => m.SuppliersDashboardComponent),
    canActivate: [authGuard, rolesGuard(['CompanyOwner', 'Accountant'], '/admin')]
  },
  {
    path: 'report',
    loadComponent: () => import('./pages/report-dashboard.component').then(m => m.ReportDashboardComponent),
    canActivate: [authGuard, rolesGuard(['CompanyOwner', 'Accountant'], '/admin')]
  },

  // ── Accountant-only routes ────────────────────────────────────
  {
    path: 'purchase-requests',
    loadComponent: () => import('./pages/purchase-requests.component').then(m => m.PurchaseRequestsComponent),
    canActivate: [authGuard, rolesGuard(['Accountant'], '/sales')]
  },
  {
    path: 'purchase-history',
    loadComponent: () => import('./pages/purchase-history.component').then(m => m.PurchaseHistoryComponent),
    canActivate: [authGuard, rolesGuard(['Accountant'], '/sales')]
  },
  {
    path: 'accountant-ai-reports',
    loadComponent: () => import('./pages/accountant-ai-reports.component').then(m => m.AccountantAiReportsComponent),
    canActivate: [authGuard, rolesGuard(['Accountant'], '/sales')]
  },

  // ── Authenticated routes ──────────────────────────────────────
  {
    path: 'assistant',
    loadComponent: () => import('./pages/assistant.component').then(m => m.AssistantComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'face-verify',
    loadComponent: () => import('./pages/face-verify.component').then(m => m.FaceVerifyComponent),
    canActivate: [authGuard]
  },

  // ── Admin routes ──────────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard, rolesGuard(['Admin'], '/sales')]
  },
];
