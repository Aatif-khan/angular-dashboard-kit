import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg transition-colors duration-300 p-4">
      <div class="card w-full max-w-md relative overflow-hidden">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="material-icons-outlined text-3xl">lock_reset</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
          <p class="text-slate-500 dark:text-slate-400">No worries, we'll send you reset instructions.</p>
        </div>

        <div *ngIf="errorMsg()" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2 animate-in fade-in zoom-in duration-200">
          <span class="material-icons-outlined text-sm">error_outline</span>
          {{ errorMsg() }}
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-icons-outlined text-xl">mail</span>
              </span>
              <input 
                type="email" 
                formControlName="email"
                (input)="errorMsg.set(null)"
                class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                placeholder="Enter your email"
              >
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="forgotForm.invalid || isLoading()"
            class="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
          >
            {{ isLoading() ? 'Sending...' : 'Reset Password' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <a routerLink="/auth/login" class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
            <span class="material-icons-outlined text-sm">arrow_back</span>
            Back to login
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading.set(true);
      this.errorMsg.set(null);

      this.authService.forgotPassword(this.forgotForm.value.email!).subscribe({
        next: (res) => {
          this.notify.success(res.message);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMsg.set(err.message || 'Failed to process request');
        }
      });
    }
  }
}
