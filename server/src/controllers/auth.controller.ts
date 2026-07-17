import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ResponseHelper } from '../helpers/response.helper.js';
import { catchAsync } from '../utils/error.handler.js';
import { MESSAGES } from '../constants/messages.js';

const authService = new AuthService();

/**
 * Handles user registration.
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return ResponseHelper.created(res, result, MESSAGES.AUTH.REGISTER_SUCCESS);
});

/**
 * Handles user login.
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return ResponseHelper.success(res, result, MESSAGES.AUTH.SUCCESS);
});

/**
 * Handles request for password reset link.
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  return ResponseHelper.success(res, null, MESSAGES.AUTH.RESET_LINK_SENT);
});

/**
 * Handles resetting password.
 */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);
  return ResponseHelper.success(res, null, MESSAGES.AUTH.RESET_SUCCESS);
});
