import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-full bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border flex flex-col transition-colors duration-300">
      <div class="h-16 flex items-center px-6 border-b border-slate-200 dark:border-dark-border">
        <span class="text-xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">DashKit</span>
      </div>
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">
          <li>
            <a routerLink="/dashboard" routerLinkActive="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group">
              <span class="material-icons-outlined text-xl group-hover:scale-110 transition-transform">dashboard</span>
              <span class="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/users" routerLinkActive="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group">
              <span class="material-icons-outlined text-xl group-hover:scale-110 transition-transform">people</span>
              <span class="font-medium">Users</span>
            </a>
          </li>
          <li>
            <a routerLink="/reports" routerLinkActive="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group">
              <span class="material-icons-outlined text-xl group-hover:scale-110 transition-transform">analytics</span>
              <span class="font-medium">Reports</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="p-4 border-t border-slate-200 dark:border-dark-border">
        <a routerLink="/settings" routerLinkActive="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1 transition-all duration-200 group">
          <span class="material-icons-outlined text-xl group-hover:scale-110 transition-transform">settings</span>
          <span class="font-medium">Settings</span>
        </a>
      </div>
    </aside>
  `
})
export class SidebarComponent {}
