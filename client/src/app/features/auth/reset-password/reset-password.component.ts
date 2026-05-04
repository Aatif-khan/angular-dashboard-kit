import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg transition-colors duration-300 p-4">
      <div class="card w-full max-w-md relative overflow-hidden">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="material-icons-outlined text-3xl">password</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Set New Password</h1>
          <p class="text-slate-500 dark:text-slate-400">Your new password must be different from previous passwords.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-icons-outlined text-xl">lock</span>
              </span>
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                formControlName="password"
                class="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none"
                placeholder="••••••••"
              >
              <button type="button" (click)="showPassword.set(!showPassword())" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                <span class="material-icons-outlined text-xl">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="resetForm.invalid || isLoading()"
            class="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {{ isLoading() ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  showPassword = signal(false);
  token: string | null = null;

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.notify.error('Invalid or missing reset token');
      this.router.navigate(['/auth/login']);
    }
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.isLoading.set(true);
      this.authService.resetPassword({ token: this.token, password: this.resetForm.value.password }).subscribe({
        next: (res) => {
          this.notify.success(res.message);
          this.router.navigate(['/auth/login']);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
}
