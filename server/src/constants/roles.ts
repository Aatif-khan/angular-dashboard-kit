/**
 * Read-only dictionary of system user roles.
 */
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

/**
 * Union type representing valid user role string values.
 */
export type Role = typeof ROLES[keyof typeof ROLES];
