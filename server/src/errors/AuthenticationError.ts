import { ApiError } from './ApiError.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Error thrown when authentication fails.
 */
export class AuthenticationError extends ApiError {
  constructor(
    message: string = MESSAGES.AUTH.UNAUTHORIZED,
    errorCode?: string
  ) {
    super(HTTP_STATUS.UNAUTHORIZED, message, errorCode, true);
  }
}
