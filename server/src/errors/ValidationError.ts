import { ApiError } from './ApiError.js';
import { HTTP_STATUS } from '../constants/http-status.js';

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends ApiError {
  public readonly errors?: unknown;

  constructor(
    message: string = 'Validation failed',
    errors?: unknown,
    errorCode?: string
  ) {
    super(HTTP_STATUS.BAD_REQUEST, message, errorCode, true);
    this.errors = errors;
  }
}
