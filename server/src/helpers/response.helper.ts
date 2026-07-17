import { Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status.js';

/**
 * Utility helper class for standardizing Express API JSON responses.
 */
export class ResponseHelper {
  /**
   * Send a standard 200 OK success response.
   */
  public static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a 201 Created success response.
   */
  public static created<T>(
    res: Response,
    data: T,
    message = 'Created'
  ): Response {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a 204 No Content response.
   */
  public static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Send an error response.
   */
  public static error(
    res: Response,
    message = 'An error occurred',
    errors?: unknown,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ): Response {
    const payload: { success: boolean; message: string; errors?: unknown } = {
      success: false,
      message,
    };

    if (errors !== undefined) {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  }

  /**
   * Send a paginated success response.
   */
  public static paginated<T>(
    res: Response,
    data: T[],
    meta: unknown,
    message = 'Success'
  ): Response {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      meta,
    });
  }
}
