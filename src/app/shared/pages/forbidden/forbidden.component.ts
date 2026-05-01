import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div class="w-32 h-32 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <span class="material-icons-outlined text-6xl">gpp_bad</span>
      </div>
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">Access Denied</h1>
      <p class="text-lg text-slate-500 dark:text-slate-400 max-w-md mb-8">
        You do not have the required permissions to view this page. Please contact your administrator if you believe this is a mistake.
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
export class ForbiddenComponent {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
