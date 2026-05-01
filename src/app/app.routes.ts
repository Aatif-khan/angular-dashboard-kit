import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ─── Default redirect ────────────────────────────────────────────────────
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // ─── Auth routes (public) ────────────────────────────────────────────────
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  // ─── Shell (protected) ───────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/shell/shell.component').then(
        (m) => m.ShellComponent,
      ),
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },

      // User Management — admin + editor only
      {
        path: 'users',
        title: 'User Management',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'editor'] },
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.usersRoutes),
      },

      // Reports / Data Table
      {
        path: 'reports',
        title: 'Reports',
        loadComponent: () =>
          import('./features/reports/data-table/data-table.component').then(
            (m) => m.DataTableComponent,
          ),
      },

      // Profile
      {
        path: 'profile',
        title: 'My Profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },

      // Settings
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },

      // Notifications
      {
        path: 'notifications',
        title: 'Notifications',
        loadComponent: () =>
          import('./features/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
      },
    ],
  },

  // ─── Error pages ─────────────────────────────────────────────────────────
  {
    path: 'forbidden',
    title: '403 Forbidden',
    loadComponent: () =>
      import('./shared/pages/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent,
      ),
  },
  {
    path: '**',
    title: '404 Not Found',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
