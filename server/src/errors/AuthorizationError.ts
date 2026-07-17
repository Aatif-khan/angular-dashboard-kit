import { ApiError } from './ApiError.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Error thrown when an authenticated user does not have permission for an action.
 */
export class AuthorizationError extends ApiError {
  constructor(
    message: string = MESSAGES.AUTH.FORBIDDEN,
    errorCode?: string
  ) {
    super(HTTP_STATUS.FORBIDDEN, message, errorCode, true);
  }
}
