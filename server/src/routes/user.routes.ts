import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes are protected by JWT
router.use(authenticateJWT as any);

// Profile routes (Any authenticated user can access their own profile)
router.get('/profile', getProfile as any);
router.put('/profile', updateProfile as any);
router.put('/profile/password', updatePassword as any);

// User Management routes (Admin/Editor restricted)
router.get('/', getUsers as any);
router.post('/', authorizeRoles('admin', 'editor') as any, createUser as any);
router.put('/:id', authorizeRoles('admin', 'editor') as any, updateUser as any);
router.delete('/:id', authorizeRoles('admin') as any, deleteUser as any);

export default router;
