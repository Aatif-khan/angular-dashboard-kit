import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-header></app-header>
        
        <!-- Global Toasts -->
        <app-toast></app-toast>

        <main class="flex-1 overflow-y-auto p-6">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {}
