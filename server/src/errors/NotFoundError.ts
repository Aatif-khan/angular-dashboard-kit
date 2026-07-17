import { ApiError } from './ApiError.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Error thrown when a requested resource is not found.
 */
export class NotFoundError extends ApiError {
  constructor(
    message: string = MESSAGES.DATABASE.RECORD_NOT_FOUND,
    errorCode?: string
  ) {
    super(HTTP_STATUS.NOT_FOUND, message, errorCode, true);
  }
}
