import { env } from './env.js';
/**
 * Mail service configuration containing API keys and sender credentials.
 */
export const mailConfig = {
    apiKey: env.SENDGRID_API_KEY,
    fromEmail: env.SENDGRID_FROM_EMAIL,
    defaultSenderName: 'DashKit Admin',
};
