import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from '../../../store/user/user.actions';
import { selectAllUsers, selectUserLoading, selectUserError } from '../../../store/user/user.selectors';
import { selectUserRoles } from '../../../store/auth/auth.selectors';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { map, take, startWith } from 'rxjs/operators';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { HasRoleDirective } from '../../../shared/directives/has-role.directive';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { User } from '../../../core/models/auth.model';
import { selectUser } from '../../../store/auth/auth.selectors';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, TitleCasePipe, HasRoleDirective, UserFormComponent, ConfirmDialogComponent, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Manage platform users, roles, and access levels.</p>
        </div>
        <button (click)="openAddModal()" class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2">
          <span class="material-icons-outlined text-sm">person_add</span> Add User
        </button>
      </div>

      <!-- Modal & Dialog Containers -->
      <app-user-form 
        *ngIf="showModal" 
        [user]="selectedUser" 
        (save)="onSave($event)" 
        (cancel)="closeModal()"
      ></app-user-form>

      <app-confirm-dialog
        *ngIf="showConfirm"
        title="Delete User"
        [message]="'Are you sure you want to delete ' + userToDelete?.firstName + '?'"
        (confirm)="onConfirmDelete()"
        (cancel)="closeConfirm()"
      ></app-confirm-dialog>

      <div class="card overflow-hidden p-0">
        <!-- Toolbar -->
        <div class="p-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-dark-surface/50">
          <div class="relative w-64">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <span class="material-icons-outlined text-sm">search</span>
            </span>
            <input type="text" [formControl]="searchControl" class="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors" placeholder="Search users...">
          </div>
          <div class="flex gap-2">
            <select [formControl]="roleFilterControl" class="px-3 py-2 border border-slate-200 dark:border-dark-border rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button (click)="exportToCSV()" class="px-3 py-2 border border-slate-200 dark:border-dark-border rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
              <span class="material-icons-outlined text-sm">download</span> Export CSV
            </button>
          </div>
        </div>

        <!-- Table Loading State -->
        <div *ngIf="loading$ | async" class="p-8 flex justify-center items-center">
          <span class="material-icons-outlined animate-spin text-primary-500 text-3xl">autorenew</span>
        </div>

        <!-- Table Data -->
        <div class="overflow-x-auto" *ngIf="(loading$ | async) === false">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-dark-border">
                <th class="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-dark-border">
              <tr *ngFor="let user of filteredUsers$ | async" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center font-semibold">
                      {{ user.firstName[0] }}{{ user.lastName[0] }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-900 dark:text-white">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 text-xs font-medium rounded-full" 
                        [class.bg-emerald-100]="user.roles.includes('admin')"
                        [class.text-emerald-700]="user.roles.includes('admin')"
                        [class.dark:bg-emerald-500/20]="user.roles.includes('admin')"
                        [class.dark:text-emerald-400]="user.roles.includes('admin')"
                        
                        [class.bg-blue-100]="user.roles.includes('editor')"
                        [class.text-blue-700]="user.roles.includes('editor')"
                        [class.dark:bg-blue-500/20]="user.roles.includes('editor')"
                        [class.dark:text-blue-400]="user.roles.includes('editor')"

                        [class.bg-slate-100]="user.roles.includes('viewer')"
                        [class.text-slate-700]="user.roles.includes('viewer')"
                        [class.dark:bg-slate-500/20]="user.roles.includes('viewer')"
                        [class.dark:text-slate-400]="user.roles.includes('viewer')"
                  >
                    {{ user.roles[0] | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-sm text-slate-600 dark:text-slate-300">Active</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ng-container *ngIf="(currentUser$ | async)?.id !== user.id; else selfBadge">
                    <button (click)="openEditModal(user)" class="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 transition-colors">
                      <span class="material-icons-outlined text-xl">edit</span>
                    </button>
                    <button *appHasRole="['admin']" (click)="requestDelete(user)" class="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors ml-1">
                      <span class="material-icons-outlined text-xl">delete</span>
                    </button>
                  </ng-container>
                  <ng-template #selfBadge>
                    <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">You</span>
                  </ng-template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  private store = inject(Store);
  private notify = inject(NotificationService);

  searchControl = new FormControl('');
  roleFilterControl = new FormControl('all');

  loading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);
  currentUser$ = this.store.select(selectUser);

  filteredUsers$: Observable<User[]> = combineLatest([
    this.store.select(selectAllUsers),
    this.searchControl.valueChanges.pipe(startWith('')),
    this.roleFilterControl.valueChanges.pipe(startWith('all'))
  ]).pipe(
    map(([users, searchTerm, roleFilter]: [User[], string | null, string | null]) => {
      return users.filter((user: User) => {
        const matchesSearch = !searchTerm || 
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter!);
        
        return matchesSearch && matchesRole;
      });
    })
  );

  showModal = false;
  showConfirm = false;
  selectedUser: User | null = null;
  userToDelete: User | null = null;

  // Determine if the current logged in user has admin role to show delete button
  isAdmin$ = this.store.select(selectUserRoles).pipe(
    map(roles => roles.includes('admin'))
  );

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  requestDelete(user: User) {
    this.userToDelete = user;
    this.showConfirm = true;
  }

  onConfirmDelete() {
    if (this.userToDelete) {
      this.store.dispatch(UserActions.deleteUser({ id: this.userToDelete.id }));
      this.notify.success(`User "${this.userToDelete.firstName}" deleted successfully`);
    }
    this.closeConfirm();
  }

  closeConfirm() {
    this.showConfirm = false;
    this.userToDelete = null;
  }

  exportToCSV() {
    this.filteredUsers$.pipe(take(1)).subscribe((users: User[]) => {
      const headers = ['ID,First Name,Last Name,Email,Roles'];
      const rows = users.map((u: User) => 
        `"${u.id}","${u.firstName}","${u.lastName}","${u.email}","${u.roles.join('|')}"`
      );
      const csvContent = headers.concat(rows).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  openAddModal() {
    this.selectedUser = null;
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  onSave(userData: any) {
    if (this.selectedUser) {
      this.store.dispatch(UserActions.updateUser({ user: userData }));
      this.notify.success('User updated successfully');
    } else {
      this.store.dispatch(UserActions.addUser({ user: userData }));
      this.notify.success('New user created successfully');
    }
    this.closeModal();
  }
}
