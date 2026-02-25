import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="csv-upload">
      <label class="file-label">
        <span>Select CSV</span>
        <input type="file" accept=".csv" (change)="onFileChange($event)" />
      </label>
      <button class="button" type="button" (click)="emitFile()" [disabled]="!selected">
        Upload
      </button>
      <span class="file-name" *ngIf="selected">{{ selected.name }}</span>
    </div>
  `,
  styles: [
    `
      .csv-upload {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .file-label {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px dashed rgba(5, 38, 89, 0.25);
        font-size: 13px;
        cursor: pointer;
        color: #052659;
        background: rgba(193, 232, 255, 0.35);
      }

      .file-label input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }

      .file-name {
        font-size: 12px;
        color: #6b7280;
      }
    `,
  ],
})
export class CsvUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  selected?: File;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selected = file;
    }
  }

  emitFile() {
    if (this.selected) {
      this.fileSelected.emit(this.selected);
    }
  }
}
