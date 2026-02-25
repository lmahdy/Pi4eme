import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    template: `
    <div class="card">
      <h2>{{ 'ADMIN.TITLE' | translate }}</h2>
      
      <div class="filters">
        <input type="text" [(ngModel)]="searchTerm" [placeholder]="'ADMIN.SEARCH_PLACEHOLDER' | translate" class="search-input" />
        <select [(ngModel)]="roleFilter">
          <option value="">{{ 'ADMIN.ALL_ROLES' | translate }}</option>
          <option value="Admin">{{ 'ADMIN.ADMIN_ROLE' | translate }}</option>
          <option value="CompanyOwner">{{ 'ADMIN.OWNER_ROLE' | translate }}</option>
          <option value="Accountant">{{ 'ADMIN.ACCOUNTANT_ROLE' | translate }}</option>
        </select>
      </div>

      <table class="table admin-table">
        <thead>
          <tr>
            <th (click)="sort('companyId')">{{ 'ADMIN.COMPANY_ID' | translate }} ↕</th>
            <th (click)="sort('name')">{{ 'ADMIN.NAME' | translate }} ↕</th>
            <th (click)="sort('email')">{{ 'ADMIN.EMAIL' | translate }} ↕</th>
            <th (click)="sort('role')">{{ 'ADMIN.ROLE' | translate }} ↕</th>
            <th>{{ 'ADMIN.STATUS' | translate }}</th>
            <th>{{ 'ADMIN.ACTIONS' | translate }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers()">
            <td>{{ user.companyId }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span [class]="'badge ' + (user.status === 'active' ? 'badge-success' : 'badge-danger')">
                {{ user.status }}
              </span>
            </td>
            <td>
              <button class="button-small" (click)="toggleStatus(user)">
                {{ user.status === 'active' ? ('ADMIN.DEACTIVATE' | translate) : ('ADMIN.ACTIVATE' | translate) }}
              </button>
              <button class="button-small button-danger" (click)="deleteUser(user)">
                {{ 'ADMIN.DELETE' | translate }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  `,
    styles: [`
    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
    }
    .search-input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid #d1d5db;
      border-radius: 999px;
      font-size: 14px;
    }
    select {
      padding: 8px 10px;
      border-radius: 999px;
      border: 1px solid #d1d5db;
      font-size: 14px;
    }
    .badge-success { background-color: rgba(16, 185, 129, 0.1); color: #047857; }
    .badge-danger { background-color: rgba(239, 68, 68, 0.1); color: #b91c1c; }
    .button-small {
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      margin-right: 4px;
      border-radius: 999px;
      border: none;
      background: var(--tenexa-soft-blue, #7da0ca);
      color: var(--tenexa-navy, #021024);
    }
    .button-danger {
      background-color: #ef4444;
      color: white;
    }
    .admin-table th {
      background: rgba(193, 232, 255, 0.3);
    }
    th { cursor: pointer; user-select: none; }
  `]
})
export class AdminPanelComponent implements OnInit {
    users: any[] = [];
    searchTerm = '';
    roleFilter = '';
    sortKey = 'name';
    sortOrder: 'asc' | 'desc' = 'asc';

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.api.getAllUsers().subscribe(users => {
            this.users = users;
        });
    }

    filteredUsers() {
        return this.users
            .filter(u => {
                const matchesSearch = (u.name || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    (u.email || '').toLowerCase().includes(this.searchTerm.toLowerCase());
                const matchesRole = this.roleFilter ? u.role === this.roleFilter : true;
                return matchesSearch && matchesRole;
            })
            .sort((a, b) => {
                const valA = a[this.sortKey] || '';
                const valB = b[this.sortKey] || '';
                if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
    }

    sort(key: string) {
        if (this.sortKey === key) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortKey = key;
            this.sortOrder = 'asc';
        }
    }

    toggleStatus(user: any) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        this.api.updateUserStatus(user._id, newStatus).subscribe(() => {
            user.status = newStatus;
        });
    }

    deleteUser(user: any) {
        if (confirm('ADMIN.DELETE_CONFIRM')) {
            this.api.deleteUser(user._id).subscribe({
                next: () => {
                    alert('ADMIN.DELETE_SUCCESS');
                    this.loadUsers(); // Refresh the list
                },
                error: () => {
                    alert('ADMIN.DELETE_FAILED');
                }
            });
        }
    }
}
