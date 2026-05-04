import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgIf, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg transition-colors duration-300 p-4">
      <div class="card w-full max-w-md relative overflow-hidden">
        <!-- Decorative background elements -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p class="text-slate-500 dark:text-slate-400">Enter your credentials to access your dashboard</p>
          </div>

          <div *ngIf="error$ | async as error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
            <span class="material-icons-outlined text-sm">error_outline</span>
            {{ error }}
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span class="material-icons-outlined text-xl">mail</span>
                </span>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  placeholder="admin@dashkit.com"
                >
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a routerLink="/auth/forgot-password" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Forgot password?</a>
              </div>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span class="material-icons-outlined text-xl">lock</span>
                </span>
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password"
                  class="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                >
                <button type="button" (click)="togglePassword()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none">
                  <span class="material-icons-outlined text-xl">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid || (loading$ | async)"
              class="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ng-container *ngIf="loading$ | async; else loginText">
                <span class="material-icons-outlined animate-spin text-sm">autorenew</span>
                Signing in...
              </ng-container>
              <ng-template #loginText>Sign In</ng-template>
            </button>
          </form>
          
          <div class="mt-6 pt-6 border-t border-slate-100 dark:border-dark-border text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Demo accounts: <br/>
              <span class="font-medium text-slate-700 dark:text-slate-300">admin&#64;dashkit.com</span> or <span class="font-medium text-slate-700 dark:text-slate-300">user&#64;dashkit.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  loginForm = this.fb.group({
    email: ['admin@dashkit.com', [Validators.required, Validators.email]],
    password: ['password123', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      this.store.dispatch(AuthActions.login({ credentials }));
    }
  }
}
