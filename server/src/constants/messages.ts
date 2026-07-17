/**
 * Unified application messaging catalog for API outputs.
 */
export const MESSAGES = {
  AUTH: {
    SUCCESS: 'Login successful',
    LOGOUT: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_MISSING: 'Authentication token missing',
    TOKEN_INVALID: 'Token is invalid or expired',
    UNAUTHORIZED: 'User not authenticated',
    FORBIDDEN: 'You do not have permission to perform this action',
    EMAIL_IN_USE: 'Email is already in use',
    REGISTER_SUCCESS: 'User registered successfully',
    RESET_LINK_SENT: 'Reset link sent to email.',
    RESET_SUCCESS: 'Password has been reset successfully.',
  },
  USER: {
    NOT_FOUND: 'User not found',
    PASSWORD_UPDATED: 'Password updated successfully',
    DELETED: 'User deleted successfully',
  },
  DATABASE: {
    DUPLICATE_FIELD: 'Duplicate field value entered',
    RECORD_NOT_FOUND: 'The requested record does not exist.',
    CONNECTION_FAILED: 'Database connection failed',
  },
} as const;
