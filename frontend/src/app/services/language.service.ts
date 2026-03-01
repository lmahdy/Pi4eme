import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private renderer: Renderer2;

    constructor(
        private translate: TranslateService,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        const savedLang = localStorage.getItem('app_lang') || 'en';
        this.setLanguage(savedLang);
    }

    setLanguage(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('app_lang', lang);

        if (lang === 'ar') {
            this.renderer.setAttribute(document.documentElement, 'dir', 'rtl');
            this.renderer.setAttribute(document.documentElement, 'lang', 'ar');
        } else {
            this.renderer.setAttribute(document.documentElement, 'dir', 'ltr');
            this.renderer.setAttribute(document.documentElement, 'lang', lang);
        }
    }

    getCurrentLanguage() {
        return this.translate.currentLang || 'en';
    }
}
