/**
 * Application routing endpoint directory map.
 */
export const API_ROUTES = {
  BASE_PREFIX: '/api',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/profile',
    PROFILE_PASSWORD: '/profile/password',
    BY_ID: '/:id',
  },
} as const;
