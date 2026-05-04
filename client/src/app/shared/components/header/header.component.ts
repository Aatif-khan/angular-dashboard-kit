import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectUser } from '../../../store/auth/auth.selectors';
import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { selectAllNotifications } from '../../../store/notification/notification.selectors';
import { map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, RouterLinkActive, NgClass],
  template: `
    <header class="h-16 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-6 transition-colors duration-300 z-10 relative">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">Overview</h1>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Theme Toggle -->
        <button (click)="themeService.toggleTheme()" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <span class="material-icons-outlined">{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        
        <!-- Notifications -->
        <button 
          routerLink="/notifications" 
          routerLinkActive 
          #rla="routerLinkActive"
          class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
          [ngClass]="{'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': rla.isActive}"
        >
          <span class="material-icons-outlined">notifications</span>
          <span *ngIf="(notificationCount$ | async) ?? 0 > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-surface"></span>
        </button>
        
        <!-- User Profile Dropdown -->
        <div class="relative ml-2">
          <button (click)="toggleDropdown()" class="flex items-center focus:outline-none">
            <div class="h-8 w-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center font-semibold border border-primary-200 dark:border-primary-800 cursor-pointer shadow-sm">
              <ng-container *ngIf="user$ | async as user; else defaultAvatar">
                {{ user.firstName[0] }}{{ user.lastName[0] }}
              </ng-container>
              <ng-template #defaultAvatar>JD</ng-template>
            </div>
          </button>

          <!-- Dropdown Menu -->
          <div *ngIf="isDropdownOpen()" class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-slate-200 dark:border-dark-border overflow-hidden z-50">
            <div class="px-4 py-3 border-b border-slate-100 dark:border-dark-border" *ngIf="user$ | async as user">
              <p class="text-sm font-medium text-slate-900 dark:text-white">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ user.email }}</p>
            </div>
            <ul class="py-1">
              <li>
                <a routerLink="/profile" (click)="isDropdownOpen.set(false)" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors">
                  <span class="material-icons-outlined text-sm">person</span>
                  My Profile
                </a>
              </li>
              <li>
                <a routerLink="/settings" (click)="isDropdownOpen.set(false)" class="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors">
                  <span class="material-icons-outlined text-sm">settings</span>
                  Settings
                </a>
              </li>
              <li class="border-t border-slate-100 dark:border-dark-border mt-1 pt-1">
                <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors">
                  <span class="material-icons-outlined text-sm">logout</span>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <!-- Invisible overlay to close dropdown when clicking outside -->
    <div *ngIf="isDropdownOpen()" (click)="isDropdownOpen.set(false)" class="fixed inset-0 z-0"></div>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  private store = inject(Store);
  
  user$ = this.store.select(selectUser);
  notificationCount$ = this.store.select(selectAllNotifications).pipe(map(n => n.length));
  isDropdownOpen = signal(false);

  toggleDropdown() {
    this.isDropdownOpen.update(val => !val);
  }

  logout() {
    this.isDropdownOpen.set(false);
    this.store.dispatch(AuthActions.logout());
  }
}
