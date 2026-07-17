import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { ResponseHelper } from '../helpers/response.helper.js';
import { catchAsync } from '../utils/error.handler.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const userService = new UserService();

/**
 * Retrieves all users.
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return ResponseHelper.success(res, users);
});

/**
 * Creates a new user.
 */
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  return ResponseHelper.created(res, user);
});

/**
 * Updates a user by ID.
 */
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.updateUser(id as string, req.body);
  return ResponseHelper.success(res, user);
});

/**
 * Deletes a user by ID.
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id as string);
  return ResponseHelper.success(res, null, 'User deleted successfully');
});

/**
 * Retrieves the profile of the currently authenticated user.
 */
export const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return ResponseHelper.error(res, 'User not authenticated', null, 401);
  }
  const user = await userService.getProfile(userId);
  return ResponseHelper.success(res, user);
});

/**
 * Updates the profile of the currently authenticated user.
 */
export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return ResponseHelper.error(res, 'User not authenticated', null, 401);
  }
  const user = await userService.updateProfile(userId, req.body);
  return ResponseHelper.success(res, user);
});

/**
 * Updates the password of the currently authenticated user.
 */
export const updatePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return ResponseHelper.error(res, 'User not authenticated', null, 401);
  }
  await userService.updatePassword(userId, req.body);
  return ResponseHelper.success(res, null, 'Password updated successfully');
});
