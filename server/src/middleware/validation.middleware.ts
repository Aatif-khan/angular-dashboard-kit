import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { ValidationError } from '../errors/ValidationError.js';

/**
 * Interface representing target schemas for validation.
 */
export interface ValidationSchema {
  body?: ZodType<any, any, any>;
  query?: ZodType<any, any, any>;
  params?: ZodType<any, any, any>;
}

/**
 * Reusable request validation middleware using Zod schemas.
 * Accepts either a single Zod schema (validates body) or a ValidationSchema object (validates body, query, and params).
 */
export const validate = (schema: ZodType<any, any, any> | ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema instanceof ZodType) {
        req.body = await schema.parseAsync(req.body);
      } else {
        if (schema.body) {
          req.body = await schema.body.parseAsync(req.body);
        }
        if (schema.query) {
          req.query = await schema.query.parseAsync(req.query);
        }
        if (schema.params) {
          req.params = await schema.params.parseAsync(req.params);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ValidationError('Validation failed', errorDetails));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
