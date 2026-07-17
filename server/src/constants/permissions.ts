/**
 * Dictionary of actions and scopes used for Role-Based Access Control (RBAC).
 */
export const PERMISSIONS = {
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  REPORTS: {
    READ: 'reports:read',
    EXPORT: 'reports:export',
  },
  SETTINGS: {
    READ: 'settings:read',
    UPDATE: 'settings:update',
  },
} as const;

/**
 * Union type representing valid permission string definitions.
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
