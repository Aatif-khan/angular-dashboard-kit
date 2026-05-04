import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Settings</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Manage global configuration and organizational preferences for the entire dashboard.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar Links -->
        <div class="md:col-span-1 space-y-1">
          <button 
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.id"
            [class.bg-white]="activeTab === tab.id"
            [class.dark:bg-slate-800]="activeTab === tab.id"
            [class.shadow-sm]="activeTab === tab.id"
            [class.text-primary-600]="activeTab === tab.id"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <span class="material-icons-outlined text-xl">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- Content Area -->
        <div class="md:col-span-2">
          <!-- Organization Tab -->
          <div *ngIf="activeTab === 'organization'" class="card space-y-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Organization Profile</h3>
            
            <form [formGroup]="orgForm" class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace Name</label>
                <input type="text" formControlName="workspaceName" placeholder="e.g. Acme Corp Admin" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Language</label>
                  <select formControlName="language" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none">
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                  <select formControlName="timezone" class="form-input block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 outline-none">
                    <option value="utc">UTC (+00:00)</option>
                    <option value="est">EST (-05:00)</option>
                    <option value="pst">PST (-08:00)</option>
                  </select>
                </div>
              </div>

              <div class="pt-4 flex justify-end">
                <button (click)="saveOrgSettings()" class="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
                  Update Workspace
                </button>
              </div>
            </form>
          </div>

          <!-- Security Tab (Global) -->
          <div *ngIf="activeTab === 'security'" class="card space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Global Security Policies</h3>
              <span class="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold uppercase rounded tracking-tight">Admin Only</span>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-dark-border">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm">Two-Factor Authentication</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Require 2FA for all team members.</p>
                </div>
                <div class="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                  <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-dark-border">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white text-sm">Session Timeout</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Auto-logout after 30 minutes of inactivity.</p>
                </div>
                <div class="w-10 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                  <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Integrations Tab -->
          <div *ngIf="activeTab === 'integrations'" class="card space-y-6">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Connected Apps</h3>
            
            <div class="grid grid-cols-1 gap-3">
              <div class="flex items-center justify-between p-4 border border-slate-100 dark:border-dark-border rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <span class="material-icons-outlined">slack</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm">Slack</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Send notifications to channels.</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 text-xs font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">Connect</button>
              </div>

              <div class="flex items-center justify-between p-4 border border-slate-100 dark:border-dark-border rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">G</div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm">Google Analytics</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Sync traffic data to dashboard.</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 text-xs font-bold text-slate-400 cursor-not-allowed">Coming Soon</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);

  activeTab = 'organization';
  orgForm!: FormGroup;

  tabs = [
    { id: 'organization', label: 'Organization', icon: 'business' },
    { id: 'security', label: 'Security Policies', icon: 'gpp_good' },
    { id: 'integrations', label: 'Integrations', icon: 'apps' }
  ];

  ngOnInit() {
    this.orgForm = this.fb.group({
      workspaceName: ['Angular Dashboard Pro', Validators.required],
      language: ['en'],
      timezone: ['est']
    });
  }

  saveOrgSettings() {
    if (this.orgForm.valid) {
      this.notify.success('Workspace configuration updated successfully!');
    }
  }
}
