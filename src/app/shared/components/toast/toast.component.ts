import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgFor, NgIf, NgClass } from '@angular/common';
import { selectAllNotifications } from '../../../store/notification/notification.selectors';
import { NotificationActions } from '../../../store/notification/notification.actions';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, NgClass],
  template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <div 
        *ngFor="let toast of notifications$ | async" 
        class="pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-full duration-300"
        [ngClass]="{
          'bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400': toast.type === 'success',
          'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400': toast.type === 'error',
          'bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400': toast.type === 'info',
          'bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400': toast.type === 'warning'
        }"
      >
        <div class="flex-shrink-0">
          <span class="material-icons-outlined text-xl" *ngIf="toast.type === 'success'">check_circle</span>
          <span class="material-icons-outlined text-xl" *ngIf="toast.type === 'error'">error_outline</span>
          <span class="material-icons-outlined text-xl" *ngIf="toast.type === 'info'">info</span>
          <span class="material-icons-outlined text-xl" *ngIf="toast.type === 'warning'">warning_amber</span>
        </div>
        
        <p class="text-sm font-medium flex-grow">{{ toast.message }}</p>
        
        <button (click)="remove(toast.id)" class="opacity-50 hover:opacity-100 transition-opacity">
          <span class="material-icons-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  private store = inject(Store);
  notifications$ = this.store.select(selectAllNotifications);
  private activeTimers = new Map<string, any>();

  constructor() {
    this.notifications$.subscribe(notifications => {
      notifications.forEach(toast => {
        if (!this.activeTimers.has(toast.id)) {
          const timer = setTimeout(() => {
            this.remove(toast.id);
          }, toast.duration || 4000);
          this.activeTimers.set(toast.id, timer);
        }
      });

      const activeIds = notifications.map(n => n.id);
      this.activeTimers.forEach((timer, id) => {
        if (!activeIds.includes(id)) {
          clearTimeout(timer);
          this.activeTimers.delete(id);
        }
      });
    });
  }

  remove(id: string) {
    this.store.dispatch(NotificationActions.removeNotification({ id }));
  }
}
