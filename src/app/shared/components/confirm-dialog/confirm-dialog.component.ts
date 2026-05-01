import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white dark:bg-dark-surface w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border p-6 animate-in zoom-in duration-200">
        <div class="flex items-center gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
            <span class="material-icons-outlined text-2xl">warning</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ message }}</p>
          </div>
        </div>

        <div class="flex gap-3 justify-end mt-6">
          <button 
            (click)="cancel.emit()" 
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            (click)="confirm.emit()" 
            class="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/20 transition-all"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
