import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  
  // Log error for the developer
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Handle Prisma Specific Errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Duplicate field value entered',
      message: `A record with this ${err.meta?.target} already exists.`
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested record does not exist.'
    });
  }

  // Send friendly response to the client
  res.status(err.statusCode).json({
    status: err.statusCode < 500 ? 'fail' : 'error',
    message: err.message || 'Internal server error'
  });
};

// Wrapper to catch errors in async routes automatically
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
