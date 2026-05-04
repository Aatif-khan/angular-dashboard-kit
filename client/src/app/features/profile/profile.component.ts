import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage your profile information and account preferences.</p>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Navigation Tabs -->
        <div class="lg:col-span-1 space-y-1">
          <button 
            (click)="activeTab = 'profile'"
            [class.bg-white]="activeTab === 'profile'"
            [class.dark:bg-slate-800]="activeTab === 'profile'"
            [class.shadow-sm]="activeTab === 'profile'"
            [class.text-primary-600]="activeTab === 'profile'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <span class="material-icons-outlined text-xl">person</span>
            Profile Information
          </button>
          <button 
            (click)="activeTab = 'preferences'"
            [class.bg-white]="activeTab === 'preferences'"
            [class.dark:bg-slate-800]="activeTab === 'preferences'"
            [class.shadow-sm]="activeTab === 'preferences'"
            [class.text-primary-600]="activeTab === 'preferences'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <span class="material-icons-outlined text-xl">settings</span>
            Preferences
          </button>
          <button 
            (click)="activeTab = 'security'"
            [class.bg-white]="activeTab === 'security'"
            [class.dark:bg-slate-800]="activeTab === 'security'"
            [class.shadow-sm]="activeTab === 'security'"
            [class.text-primary-600]="activeTab === 'security'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <span class="material-icons-outlined text-xl">lock</span>
            Security
          </button>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Profile Tab -->
          <div *ngIf="activeTab === 'profile'" class="card animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h3>
            
            <!-- Avatar Upload -->
            <div class="flex items-center gap-6 mb-8">
              <div class="relative group">
                <div class="h-24 w-24 rounded-2xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center text-3xl font-bold border-2 border-dashed border-primary-200 dark:border-primary-800 overflow-hidden">
                  {{ userInitials }}
                </div>
                <button (click)="avatarInput.click()" class="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-dark-border hover:text-primary-600 transition-colors">
                  <span class="material-icons-outlined text-sm">photo_camera</span>
                </button>
                <input #avatarInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white">Profile Photo</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">PNG, JPG or GIF. Max 2MB.</p>
                <div class="flex gap-3 mt-3">
                  <button (click)="avatarInput.click()" class="text-xs font-bold text-primary-600 hover:text-primary-700">Upload New</button>
                  <button class="text-xs font-bold text-red-500 hover:text-red-600">Remove</button>
                </div>
              </div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                  <input type="text" formControlName="firstName" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                  <input type="text" formControlName="lastName" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input type="email" formControlName="email" readonly class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed outline-none">
                <p class="text-[11px] text-slate-400 mt-1 italic">Email address cannot be changed. Contact admin for updates.</p>
              </div>
              <div class="pt-4 border-t border-slate-100 dark:border-dark-border flex justify-end">
                <button type="submit" [disabled]="profileForm.invalid || profileForm.pristine" class="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all disabled:opacity-50">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences Tab -->
          <div *ngIf="activeTab === 'preferences'" class="card animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Application Preferences</h3>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">Appearance</h4>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch between light and dark themes.</p>
                </div>
                <button (click)="toggleTheme()" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-bold transition-all">
                  <span class="material-icons-outlined text-xl">{{ themeService.isDarkMode() ? 'dark_mode' : 'light_mode' }}</span>
                  {{ themeService.isDarkMode() ? 'Dark' : 'Light' }}
                </button>
              </div>
              <div class="flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">Email Notifications</h4>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Receive weekly summaries and alerts.</p>
                </div>
                <div class="w-11 h-6 bg-primary-600 rounded-full flex items-center px-1">
                  <div class="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div *ngIf="activeTab === 'security'" class="card animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Security Settings</h3>
            <form class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input type="password" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface outline-none focus:ring-2 focus:ring-primary-500/20">
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input type="password" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface outline-none focus:ring-2 focus:ring-primary-500/20">
              </div>
              <div class="pt-4 border-t border-slate-100 dark:border-dark-border flex justify-end">
                <button type="button" (click)="updatePassword()" class="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold shadow-lg transition-all hover:scale-[1.02]">
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);
  public themeService = inject(ThemeService);

  activeTab: 'profile' | 'preferences' | 'security' = 'profile';
  profileForm!: FormGroup;
  userInitials = '';

  ngOnInit() {
    this.initForm();
    
    this.store.select(selectUser).pipe(take(1)).subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        this.userInitials = `${user.firstName[0]}${user.lastName[0]}`;
      }
    });
  }

  private initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }]
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      // In a real app, dispatch an action
      this.notify.success('Profile updated successfully!');
      this.profileForm.markAsPristine();
    }
  }

  updatePassword() {
    this.notify.info('Password update feature coming soon!');
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    const mode = this.themeService.isDarkMode() ? 'Dark' : 'Light';
    this.notify.success(`Switched to ${mode} mode`);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.notify.error('File size exceeds 2MB limit');
        return;
      }
      // Mock upload success
      this.notify.success('Profile photo uploaded successfully! (Mock)');
    }
  }
}
