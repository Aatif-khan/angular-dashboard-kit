import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes are protected by JWT
router.use(authenticateJWT as any);

router.get('/', getUsers as any);

// Only admins can create, update, or delete users
router.post('/', authorizeRoles('admin') as any, createUser as any);
router.put('/:id', authorizeRoles('admin') as any, updateUser as any);
router.delete('/:id', authorizeRoles('admin') as any, deleteUser as any);

export default router;
