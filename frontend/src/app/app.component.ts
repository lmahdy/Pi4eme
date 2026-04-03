import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, TranslateModule, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showNavigation = false;
  isAdmin$ = this.authService.isAdmin$;
  isDark$ = this.themeService.isDarkMode$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    public themeService: ThemeService
  ) { }

  get currentLang() {
    return this.languageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.showNavigation = loggedIn;
    });
  }

  changeLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
