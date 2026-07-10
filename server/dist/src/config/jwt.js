import { env } from './env.js';
/**
 * JWT configurations containing secret signing keys and token lifespans.
 */
export const jwtConfig = {
    secret: env.JWT_SECRET,
    expiresIn: '24h',
};
