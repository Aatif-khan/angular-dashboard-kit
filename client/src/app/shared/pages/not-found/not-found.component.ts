import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div class="w-32 h-32 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <span class="material-icons-outlined text-6xl">search_off</span>
      </div>
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">404 - Page Not Found</h1>
      <p class="text-lg text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      
      <button 
        (click)="goBack()" 
        class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-primary-600 text-white font-medium rounded-lg shadow hover:bg-slate-800 dark:hover:bg-primary-700 transition-colors"
      >
        <span class="material-icons-outlined text-sm">arrow_back</span>
        Go Back
      </button>
    </div>
  `
})
export class NotFoundComponent {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
