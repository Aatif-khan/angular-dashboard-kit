import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-dark-border animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ user ? 'Edit User' : 'Add New User' }}
          </h3>
          <button (click)="cancel.emit()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
              <input type="text" formControlName="firstName" class="form-input block w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none" placeholder="John">
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
              <input type="text" formControlName="lastName" class="form-input block w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none" placeholder="Doe">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input type="email" formControlName="email" class="form-input block w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none" placeholder="john.doe@example.com">
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
            <select formControlName="roles" class="form-select block w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" (click)="cancel.emit()" class="flex-1 px-4 py-2.5 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-all">
              Cancel
            </button>
            <button type="submit" [disabled]="userForm.invalid" class="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ user ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<User | Omit<User, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    roles: ['viewer', [Validators.required]]
  });

  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue({
        ...this.user,
        roles: this.user.roles[0] // Simplify for mock form
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const result = {
        ...formData,
        roles: [formData.roles], // Wrap in array
        id: this.user?.id
      };
      this.save.emit(result);
    }
  }
}
