import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllNotifications } from '../../store/notification/notification.selectors';
import { NotificationActions } from '../../store/notification/notification.actions';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <!-- Header -->
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Stay updated with your latest activities and system alerts.</p>
        </div>
        <button 
          *ngIf="(notifications$ | async)?.length"
          (click)="clearAll()"
          class="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2 transition-colors"
        >
          <span class="material-icons-outlined text-sm">delete_sweep</span>
          Clear All
        </button>
      </div>

      <!-- Notification List -->
      <div class="space-y-4">
        <div *ngIf="!(notifications$ | async)?.length" class="card flex flex-col items-center justify-center py-20 text-center">
          <div class="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <span class="material-icons-outlined text-4xl">notifications_off</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">All caught up!</h3>
          <p class="text-slate-500 dark:text-slate-400 mt-1">You have no new notifications at the moment.</p>
        </div>

        <div 
          *ngFor="let notification of notifications$ | async" 
          class="card hover:shadow-md transition-all group relative border-l-4"
          [ngClass]="{
            'border-l-emerald-500': notification.type === 'success',
            'border-l-red-500': notification.type === 'error',
            'border-l-blue-500': notification.type === 'info',
            'border-l-amber-500': notification.type === 'warning'
          }"
        >
          <div class="flex gap-4">
            <div 
              class="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              [ngClass]="{
                'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400': notification.type === 'success',
                'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400': notification.type === 'error',
                'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400': notification.type === 'info',
                'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400': notification.type === 'warning'
              }"
            >
              <span class="material-icons-outlined">
                {{ getIcon(notification.type) }}
              </span>
            </div>
            
            <div class="flex-grow">
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-slate-900 dark:text-white capitalize">{{ notification.type }}</h4>
                <span class="text-[11px] text-slate-400">Just now</span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 mt-1 text-sm">{{ notification.message }}</p>
            </div>

            <button 
              (click)="remove(notification.id)" 
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-all"
            >
              <span class="material-icons-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mock Actions -->
      <div class="pt-6 border-t border-slate-200 dark:border-dark-border mt-8">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button (click)="generateMock('success')" class="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">Test Success</button>
          <button (click)="generateMock('info')" class="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">Test Info</button>
          <button (click)="generateMock('warning')" class="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors">Test Warning</button>
          <button (click)="generateMock('error')" class="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">Test Error</button>
        </div>
      </div>
    </div>
  `
})
export class NotificationsComponent {
  private store = inject(Store);
  notifications$ = this.store.select(selectAllNotifications);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error_outline';
      case 'warning': return 'warning_amber';
      default: return 'info';
    }
  }

  remove(id: string) {
    this.store.dispatch(NotificationActions.removeNotification({ id }));
  }

  clearAll() {
    this.notifications$.subscribe(notifications => {
      notifications.forEach(n => this.remove(n.id));
    }).unsubscribe();
  }

  generateMock(type: any) {
    const messages = {
      success: 'System updated to version 2.4.0 successfully.',
      info: 'New login detected from a Chrome browser on Windows.',
      warning: 'Server storage is reaching 85% capacity.',
      error: 'Failed to synchronize with the external backup server.'
    };
    
    this.store.dispatch(NotificationActions.addNotification({
      notification: {
        message: (messages as any)[type],
        type: type,
        duration: 10000
      }
    }));
  }
}
