import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-16 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-6 transition-colors duration-300 z-10 relative">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">Overview</h1>
      </div>
      
      <div class="flex items-center gap-4">
        <button (click)="themeService.toggleTheme()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <span class="material-icons-outlined">{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        
        <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative">
          <span class="material-icons-outlined">notifications</span>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-surface"></span>
        </button>
        
        <div class="h-8 w-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center font-semibold border border-primary-200 dark:border-primary-800 ml-2 cursor-pointer shadow-sm">
          JD
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
