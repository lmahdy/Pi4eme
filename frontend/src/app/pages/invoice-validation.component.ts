import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-validation',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>🧾 Validation des Factures</h1>
        <p class="page-subtitle">Gérez et validez les factures de vente et d'achat</p>
      </div>
      <div class="header-right">
        <button class="btn-refresh" (click)="loadAll()" [disabled]="loading">
          <span [class.spinning]="loading">↻</span> Actualiser
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card total">
        <div class="kpi-icon-wrap">📋</div>
        <div class="kpi-body">
          <span class="kpi-value">{{ totalStats.total }}</span>
          <span class="kpi-label">Total Factures</span>
        </div>
        <div class="kpi-trend">{{ activeFilter === 'all' ? 'Achat + Vente' : activeFilter === 'sales' ? 'Vente' : 'Achat' }}</div>
      </div>
      <div class="kpi-card pending">
        <div class="kpi-icon-wrap">⏳</div>
        <div class="kpi-body">
          <span class="kpi-value">{{ totalStats.pending }}</span>
          <span class="kpi-label">En attente</span>
        </div>
        <div class="kpi-trend warning" *ngIf="totalStats.pending > 0">Nécessite action</div>
        <div class="kpi-trend ok" *ngIf="totalStats.pending === 0">Aucune en attente</div>
      </div>
      <div class="kpi-card approved">
        <div class="kpi-icon-wrap">✅</div>
        <div class="kpi-body">
          <span class="kpi-value">{{ totalStats.approved }}</span>
          <span class="kpi-label">Approuvées</span>
        </div>
        <div class="kpi-trend ok" *ngIf="totalStats.total > 0">
          {{ totalStats.total > 0 ? ((totalStats.approved / totalStats.total) * 100 | number:'1.0-0') : 0 }}% du total
        </div>
      </div>
      <div class="kpi-card rejected">
        <div class="kpi-icon-wrap">❌</div>
        <div class="kpi-body">
          <span class="kpi-value">{{ totalStats.rejected }}</span>
          <span class="kpi-label">Rejetées</span>
        </div>
        <div class="kpi-trend danger" *ngIf="totalStats.rejected > 0">{{ totalStats.rejected }} rejet(s)</div>
        <div class="kpi-trend ok" *ngIf="totalStats.rejected === 0">Aucun rejet</div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button class="tab-btn" [class.tab-active]="activeFilter === 'all'" (click)="setFilter('all')">
        📦 Toutes les factures
      </button>
      <button class="tab-btn" [class.tab-active]="activeFilter === 'sales'" (click)="setFilter('sales')">
        🛒 Factures de vente
      </button>
      <button class="tab-btn" [class.tab-active]="activeFilter === 'purchases'" (click)="setFilter('purchases')">
        🏭 Factures d'achat
      </button>

      <!-- Validation status filter -->
      <div class="status-filter">
        <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="status-select">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvées</option>
          <option value="rejected">Rejetées</option>
        </select>
      </div>

      <!-- Search -->
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()"
               placeholder="Rechercher (réf, client, article...)" class="search-input" />
      </div>
    </div>

    <!-- Loading -->
    <div class="card loading-card" *ngIf="loading">
      <div class="spinner"></div>
      <p>Chargement des factures...</p>
    </div>

    <!-- Invoice Table -->
    <div class="card table-card" *ngIf="!loading">
      <div class="table-header">
        <h3>Liste des factures <span class="count-badge">{{ filteredInvoices.length }}</span></h3>
      </div>

      <div class="empty-state" *ngIf="filteredInvoices.length === 0">
        <span class="empty-icon">📭</span>
        <h3>Aucune facture trouvée</h3>
        <p>Essayez un autre filtre ou ajoutez des factures depuis les pages Ventes / Achats.</p>
      </div>

      <div class="table-scroll" *ngIf="filteredInvoices.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Réf. / Description</th>
              <th>Tiers</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut Validation</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of filteredInvoices" [class.row-pending]="inv._validationStatus === 'pending'"
                [class.row-approved]="inv._validationStatus === 'approved'"
                [class.row-rejected]="inv._validationStatus === 'rejected'">
              <td>
                <span class="type-badge" [class.sale-badge]="inv._type === 'sale'" [class.purchase-badge]="inv._type === 'purchase'">
                  {{ inv._type === 'sale' ? '🛒 Vente' : '🏭 Achat' }}
                </span>
              </td>
              <td>
                <div class="ref-cell">
                  <strong>{{ getInvoiceRef(inv) }}</strong>
                  <small>{{ inv._type === 'sale' ? inv.product : inv.item }}</small>
                </div>
              </td>
              <td>
                <span class="tiers">{{ inv._type === 'sale' ? (inv.customer || '—') : (inv.supplier || '—') }}</span>
              </td>
              <td>
                <strong class="amount">{{ (inv._type === 'sale' ? inv.totalAmount : inv.totalCost) | number:'1.2-2' }} DZD</strong>
              </td>
              <td>{{ inv.date | date:'dd/MM/yyyy' }}</td>
              <td>
                <span class="status-chip"
                  [class.chip-pending]="inv._validationStatus === 'pending'"
                  [class.chip-approved]="inv._validationStatus === 'approved'"
                  [class.chip-rejected]="inv._validationStatus === 'rejected'">
                  <span class="chip-dot"></span>
                  {{ inv._validationStatus === 'pending' ? 'En attente' : inv._validationStatus === 'approved' ? 'Approuvée' : 'Rejetée' }}
                </span>
              </td>
              <td>
                <span class="notes-text" *ngIf="inv.rejectionNote" title="{{ inv.rejectionNote }}">
                  💬 {{ inv.rejectionNote | slice:0:30 }}{{ inv.rejectionNote.length > 30 ? '...' : '' }}
                </span>
                <span class="notes-empty" *ngIf="!inv.rejectionNote">—</span>
              </td>
              <td>
                <div class="action-btns" *ngIf="inv._validationStatus === 'pending'">
                  <button class="btn-approve" (click)="approve(inv)" [disabled]="inv._loading">
                    <span *ngIf="!inv._loading">✓ Approuver</span>
                    <span *ngIf="inv._loading">...</span>
                  </button>
                  <button class="btn-reject" (click)="openRejectModal(inv)" [disabled]="inv._loading">
                    ✗ Rejeter
                  </button>
                </div>
                <div class="action-btns" *ngIf="inv._validationStatus !== 'pending'">
                  <button class="btn-reset" (click)="resetToPending(inv)" title="Remettre en attente">
                    ↺
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div class="modal-overlay" *ngIf="showRejectModal" (click)="closeRejectModal()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>❌ Motif de rejet</h3>
          <button class="modal-close" (click)="closeRejectModal()">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">
            Vous êtes sur le point de rejeter la facture
            <strong>{{ getInvoiceRef(selectedInvoice) }}</strong>.
          </p>
          <label class="modal-label">Raison du rejet <span class="optional">(optionnel)</span></label>
          <textarea [(ngModel)]="rejectNote" class="modal-textarea"
                    placeholder="Ex : Montant incorrect, document manquant, doublon..." rows="4"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="closeRejectModal()">Annuler</button>
          <button class="btn-confirm-reject" (click)="confirmReject()" [disabled]="rejectLoading">
            <span *ngIf="!rejectLoading">❌ Confirmer le rejet</span>
            <span *ngIf="rejectLoading">Traitement...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <div class="toast" [class.toast-show]="toastMsg" [class.toast-error]="toastError">
      {{ toastMsg }}
    </div>
  `,
  styles: [`
    :host { --primary: #052659; --secondary: #5483B3; --accent: #C1E8FF; --bg: #f5f9ff; }

    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
    }
    .page-header h1 { font-size: 28px; font-weight: 800; color: #021024; margin: 0 0 6px; }
    .page-subtitle { color: #5483B3; font-size: 14px; margin: 0; }
    .btn-refresh {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #052659, #5483B3);
      color: white; border: none; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: opacity 0.2s;
    }
    .btn-refresh:hover { opacity: 0.88; }
    .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }
    .spinning { display: inline-block; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* KPI Cards */
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
    .kpi-card {
      background: white; border-radius: 16px; padding: 20px 22px;
      box-shadow: 0 2px 16px rgba(2,16,36,0.07); border: 1px solid rgba(84,131,179,0.12);
      display: flex; align-items: center; gap: 16px; position: relative; overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(2,16,36,0.12); }
    .kpi-card::after {
      content: ''; position: absolute; right: -20px; top: -20px;
      width: 80px; height: 80px; border-radius: 50%; opacity: 0.07;
    }
    .kpi-card.total::after { background: #052659; }
    .kpi-card.pending::after { background: #f59e0b; }
    .kpi-card.approved::after { background: #10b981; }
    .kpi-card.rejected::after { background: #ef4444; }
    .kpi-icon-wrap { font-size: 32px; flex-shrink: 0; }
    .kpi-body { display: flex; flex-direction: column; flex: 1; }
    .kpi-value { font-size: 32px; font-weight: 900; color: #021024; line-height: 1; }
    .kpi-label { font-size: 12px; color: #5483B3; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600; margin-top: 2px; }
    .kpi-trend { font-size: 11px; position: absolute; bottom: 10px; right: 14px; font-weight: 600; border-radius: 20px; padding: 2px 8px; }
    .kpi-trend.warning { background: #fef3cd; color: #b7770d; }
    .kpi-trend.ok { background: #e9f7ef; color: #1e8449; }
    .kpi-trend.danger { background: #fce7e7; color: #c0392b; }

    /* Filter Tabs */
    .filter-tabs {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      background: white; border-radius: 14px; padding: 14px 18px;
      box-shadow: 0 2px 12px rgba(2,16,36,0.06); margin-bottom: 20px;
      border: 1px solid rgba(84,131,179,0.1);
    }
    .tab-btn {
      padding: 9px 18px; border-radius: 10px; border: 1.5px solid #C1E8FF;
      background: transparent; color: #5483B3; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap;
    }
    .tab-btn:hover { background: #f0f6ff; }
    .tab-active { background: linear-gradient(135deg, #052659, #5483B3) !important; color: white !important; border-color: transparent !important; }
    .status-select {
      padding: 9px 14px; border-radius: 10px; border: 1.5px solid #C1E8FF;
      background: #f9fdff; color: #021024; font-size: 13px; font-family: inherit;
      outline: none; cursor: pointer;
    }
    .status-select:focus { border-color: #5483B3; }
    .search-wrap {
      flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px;
      background: #f9fdff; border: 1.5px solid #C1E8FF; border-radius: 10px; padding: 0 14px;
    }
    .search-icon { font-size: 15px; }
    .search-input { flex: 1; border: none; background: transparent; padding: 9px 0; font-size: 13px; font-family: inherit; color: #021024; outline: none; }

    /* Card */
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 16px rgba(2,16,36,0.07); border: 1px solid rgba(84,131,179,0.1); margin-bottom: 20px; }
    .loading-card { display: flex; align-items: center; gap: 16px; padding: 24px; }
    .spinner { width: 28px; height: 28px; border: 3px solid #C1E8FF; border-top-color: #052659; border-radius: 50%; animation: spin 0.8s linear infinite; }

    .table-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
    .table-header h3 { font-size: 16px; font-weight: 700; color: #021024; margin: 0; }
    .count-badge { background: #C1E8FF; color: #052659; border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 700; }

    .empty-state { text-align: center; padding: 48px 24px; }
    .empty-icon { font-size: 52px; display: block; margin-bottom: 12px; }
    .empty-state h3 { color: #052659; margin: 0 0 8px; }
    .empty-state p { color: #5483B3; font-size: 14px; margin: 0; }

    /* Table */
    .table-scroll { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { padding: 12px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5483B3; border-bottom: 2px solid #f0f6ff; white-space: nowrap; }
    .table td { padding: 14px; border-bottom: 1px solid #f0f6ff; vertical-align: middle; font-size: 13px; }
    .table tbody tr:hover { background: #fafcff; }
    .table tbody tr:last-child td { border-bottom: none; }

    .row-pending { border-left: 3px solid #f59e0b; }
    .row-approved { border-left: 3px solid #10b981; }
    .row-rejected { border-left: 3px solid #ef4444; }

    .type-badge { display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .sale-badge { background: #e0f2fe; color: #0369a1; }
    .purchase-badge { background: #f0fdf4; color: #15803d; }

    .ref-cell { display: flex; flex-direction: column; gap: 2px; }
    .ref-cell strong { font-size: 13px; color: #021024; }
    .ref-cell small { font-size: 11px; color: #7DA0CA; }

    .tiers { color: #021024; }
    .amount { font-size: 14px; color: #052659; }

    .status-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .chip-dot { width: 6px; height: 6px; border-radius: 50%; }
    .chip-pending { background: #fef3cd; color: #b7770d; }
    .chip-pending .chip-dot { background: #f59e0b; }
    .chip-approved { background: #d1fae5; color: #065f46; }
    .chip-approved .chip-dot { background: #10b981; }
    .chip-rejected { background: #fee2e2; color: #991b1b; }
    .chip-rejected .chip-dot { background: #ef4444; }

    .notes-text { font-size: 11px; color: #5483B3; max-width: 160px; display: block; }
    .notes-empty { color: #C1E8FF; }

    /* Action Buttons */
    .action-btns { display: flex; gap: 6px; align-items: center; }
    .btn-approve {
      padding: 6px 14px; border-radius: 8px; border: none;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white; font-size: 12px; font-weight: 700; cursor: pointer;
      transition: all 0.2s; font-family: inherit; white-space: nowrap;
    }
    .btn-approve:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-approve:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-reject {
      padding: 6px 14px; border-radius: 8px; border: 1.5px solid #fca5a5;
      background: transparent; color: #dc2626; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap;
    }
    .btn-reject:hover { background: #fee2e2; }
    .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-reset {
      padding: 6px 10px; border-radius: 8px; border: 1.5px solid #C1E8FF;
      background: transparent; color: #5483B3; font-size: 16px;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-reset:hover { background: #f0f6ff; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(2,16,36,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-box {
      background: white; border-radius: 20px; width: 100%;
      max-width: 480px; padding: 0; box-shadow: 0 20px 60px rgba(2,16,36,0.25);
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 22px 24px 0; border-bottom: 1px solid #f0f6ff; padding-bottom: 16px;
    }
    .modal-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: #021024; }
    .modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #7DA0CA; padding: 4px; border-radius: 6px; }
    .modal-close:hover { background: #f0f6ff; color: #052659; }
    .modal-body { padding: 20px 24px; }
    .modal-desc { color: #5483B3; font-size: 14px; margin: 0 0 16px; }
    .modal-label { display: block; font-size: 12px; font-weight: 700; color: #052659; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .optional { font-weight: 400; color: #7DA0CA; text-transform: none; letter-spacing: 0; }
    .modal-textarea {
      width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 10px;
      border: 1.5px solid #C1E8FF; background: #f9fdff; color: #021024;
      font-size: 14px; font-family: inherit; outline: none; resize: vertical;
      transition: border-color 0.2s;
    }
    .modal-textarea:focus { border-color: #5483B3; }
    .modal-footer {
      display: flex; gap: 10px; justify-content: flex-end;
      padding: 16px 24px 22px; border-top: 1px solid #f0f6ff;
    }
    .btn-cancel {
      padding: 10px 22px; border-radius: 10px; border: 1.5px solid #C1E8FF;
      background: transparent; color: #5483B3; font-size: 14px; font-weight: 600;
      cursor: pointer; font-family: inherit; transition: background 0.2s;
    }
    .btn-cancel:hover { background: #f0f6ff; }
    .btn-confirm-reject {
      padding: 10px 22px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white; font-size: 14px; font-weight: 700; cursor: pointer;
      font-family: inherit; transition: opacity 0.2s;
    }
    .btn-confirm-reject:hover { opacity: 0.88; }
    .btn-confirm-reject:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Toast */
    .toast {
      position: fixed; bottom: -80px; left: 50%; transform: translateX(-50%);
      background: #052659; color: white; padding: 14px 28px; border-radius: 12px;
      font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(2,16,36,0.3);
      transition: bottom 0.3s ease; z-index: 2000; white-space: nowrap;
    }
    .toast.toast-show { bottom: 32px; }
    .toast.toast-error { background: #dc2626; }

    /* Table card */
    .table-card { padding: 0; }
    .table-header { padding: 20px 24px 0; }
    .table-scroll { padding: 0 8px 8px; }
  `],
})
export class InvoiceValidationComponent implements OnInit {
  loading = false;
  activeFilter: 'all' | 'sales' | 'purchases' = 'all';
  statusFilter = '';
  searchTerm = '';

  allInvoices: any[] = [];
  filteredInvoices: any[] = [];

  totalStats = { total: 0, pending: 0, approved: 0, rejected: 0 };

  // Reject modal
  showRejectModal = false;
  selectedInvoice: any = null;
  rejectNote = '';
  rejectLoading = false;

  // Toast
  toastMsg = '';
  toastError = false;
  private toastTimer: any;

  getInvoiceRef(inv: any): string {
    if (!inv) return '...';
    if (inv.invoiceRef) return inv.invoiceRef;
    const id = inv._id || '';
    return 'FAC-' + id.substring(0, 8).toUpperCase();
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.allInvoices = [];

    // Load purchases
    this.api.getPurchasesForValidation().subscribe({
      next: (purchases) => {
        const p = (purchases || []).map(inv => ({
          ...inv,
          _type: 'purchase',
          _validationStatus: inv.validationStatus || 'pending',
          _loading: false,
        }));
        this.allInvoices = [...this.allInvoices.filter(i => i._type !== 'purchase'), ...p];
        this.computeStats();
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Load sales
    this.api.getSalesForValidation().subscribe({
      next: (sales) => {
        const s = (sales || []).map(inv => ({
          ...inv,
          _type: 'sale',
          _validationStatus: inv.validationStatus || 'pending',
          _loading: false,
        }));
        this.allInvoices = [...this.allInvoices.filter(i => i._type !== 'sale'), ...s];
        this.computeStats();
        this.applyFilters();
      },
      error: () => {}
    });
  }

  computeStats() {
    const source = this.activeFilter === 'all' ? this.allInvoices
      : this.activeFilter === 'sales' ? this.allInvoices.filter(i => i._type === 'sale')
      : this.allInvoices.filter(i => i._type === 'purchase');

    this.totalStats = {
      total: source.length,
      pending: source.filter(i => i._validationStatus === 'pending').length,
      approved: source.filter(i => i._validationStatus === 'approved').length,
      rejected: source.filter(i => i._validationStatus === 'rejected').length,
    };
  }

  setFilter(filter: 'all' | 'sales' | 'purchases') {
    this.activeFilter = filter;
    this.computeStats();
    this.applyFilters();
  }

  applyFilters() {
    let result = this.allInvoices;

    if (this.activeFilter === 'sales') result = result.filter(i => i._type === 'sale');
    if (this.activeFilter === 'purchases') result = result.filter(i => i._type === 'purchase');
    if (this.statusFilter) result = result.filter(i => i._validationStatus === this.statusFilter);

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(i =>
        (i.product || '').toLowerCase().includes(term) ||
        (i.item || '').toLowerCase().includes(term) ||
        (i.customer || '').toLowerCase().includes(term) ||
        (i.supplier || '').toLowerCase().includes(term) ||
        (i.invoiceRef || '').toLowerCase().includes(term)
      );
    }

    // Sort: pending first, then by date desc
    result = [...result].sort((a, b) => {
      const order = { pending: 0, rejected: 1, approved: 2 };
      const oa = order[a._validationStatus as keyof typeof order] ?? 3;
      const ob = order[b._validationStatus as keyof typeof order] ?? 3;
      if (oa !== ob) return oa - ob;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    this.filteredInvoices = result;
  }

  approve(inv: any) {
    inv._loading = true;
    const req = inv._type === 'sale'
      ? this.api.approveSaleInvoice(inv._id)
      : this.api.approvePurchaseInvoice(inv._id);

    req.subscribe({
      next: (updated) => {
        inv._validationStatus = 'approved';
        inv.validationStatus = 'approved';
        inv.rejectionNote = '';
        inv._loading = false;
        this.computeStats();
        this.applyFilters();
        this.showToast('✅ Facture approuvée avec succès', false);
      },
      error: () => {
        inv._loading = false;
        this.showToast('Erreur lors de l\'approbation', true);
      }
    });
  }

  openRejectModal(inv: any) {
    this.selectedInvoice = inv;
    this.rejectNote = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedInvoice = null;
    this.rejectNote = '';
  }

  confirmReject() {
    if (!this.selectedInvoice) return;
    this.rejectLoading = true;
    const inv = this.selectedInvoice;
    const note = this.rejectNote;

    const req = inv._type === 'sale'
      ? this.api.rejectSaleInvoice(inv._id, note)
      : this.api.rejectPurchaseInvoice(inv._id, note);

    req.subscribe({
      next: () => {
        inv._validationStatus = 'rejected';
        inv.validationStatus = 'rejected';
        inv.rejectionNote = note;
        this.rejectLoading = false;
        this.closeRejectModal();
        this.computeStats();
        this.applyFilters();
        this.showToast('❌ Facture rejetée', false);
      },
      error: () => {
        this.rejectLoading = false;
        this.showToast('Erreur lors du rejet', true);
      }
    });
  }

  resetToPending(inv: any) {
    if (!confirm('Remettre cette facture en attente de validation ?')) return;
    const req = inv._type === 'sale'
      ? this.api.rejectSaleInvoice(inv._id, '')
      : this.api.rejectPurchaseInvoice(inv._id, '');

    // Use approve to keep it clean — or we could add a specific reset endpoint
    // For now approve resets the status
    const approveReq = inv._type === 'sale'
      ? this.api.approveSaleInvoice(inv._id)
      : this.api.approvePurchaseInvoice(inv._id);

    // Temporarily patch status locally and reload
    inv._validationStatus = 'pending';
    inv.validationStatus = 'pending';
    inv.rejectionNote = '';
    this.computeStats();
    this.applyFilters();
  }

  private showToast(msg: string, isError: boolean) {
    this.toastMsg = msg;
    this.toastError = isError;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toastMsg = ''; }, 3200);
  }
}
