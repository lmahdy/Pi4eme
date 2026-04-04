import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'tenexa-theme';
  private darkMode$ = new BehaviorSubject<boolean>(this.loadTheme());

  isDarkMode$ = this.darkMode$.asObservable();

  constructor() {
    this.applyTheme(this.darkMode$.value);
  }

  toggle(): void {
    const next = !this.darkMode$.value;
    this.darkMode$.next(next);
    this.applyTheme(next);
    localStorage.setItem(this.STORAGE_KEY, next ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.darkMode$.value;
  }

  private loadTheme(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return saved === 'dark';
    // Default to system preference
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark-theme', dark);
  }
}
