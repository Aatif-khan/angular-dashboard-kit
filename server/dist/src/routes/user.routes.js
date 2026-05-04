import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';
const router = Router();
// All user routes are protected by JWT
router.use(authenticateJWT);
router.get('/', getUsers);
// Only admins can create, update, or delete users
router.post('/', authorizeRoles('admin'), createUser);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);
export default router;
