import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-csv-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="csv-upload">
      <input type="file" accept=".csv" (change)="onFileChange($event)" />
      <button class="button" type="button" (click)="emitFile()" [disabled]="!selected">
        Upload
      </button>
      <span *ngIf="selected">{{ selected.name }}</span>
    </div>
  `,
  styles: [
    `
      .csv-upload {
        display: flex;
        gap: 12px;
        align-items: center;
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
