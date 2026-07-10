import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from './logger.js';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection URL"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email("SENDGRID_FROM_EMAIL must be a valid email address").optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error('❌ Environment configuration validation failed:');
  logger.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

/**
 * Validated typed environment configuration object.
 */
export const env = Object.freeze(parsedEnv.data);
