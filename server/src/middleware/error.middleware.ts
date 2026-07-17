import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError.js';
import { ResponseHelper } from '../helpers/response.helper.js';
import { logger, env } from '../config/index.js';
import { HTTP_STATUS } from '../constants/http-status.js';

/**
 * Global Express error handling middleware.
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';
  let errors: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;

    // Check if validation errors or sub-errors are attached
    if ('errors' in err) {
      errors = (err as any).errors;
    }
  } else {
    // Log unexpected errors for developers/log aggregators
    logger.error(`[Unexpected Error] ${err.message || err}`, {
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    // In non-production environments, pass through the unexpected error message
    if (env.NODE_ENV !== 'production') {
      message = err.message || message;
    }
  }

  // Attach stack traces only in non-production environments
  if (env.NODE_ENV !== 'production' && errors === undefined) {
    errors = { stack: err.stack };
  }

  ResponseHelper.error(res, message, errors, statusCode);
};

export default errorMiddleware;
