import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser, getProfile, updateProfile, updatePassword } from '../controllers/user.controller.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.middleware.js';
const router = Router();
// All user routes are protected by JWT
router.use(authenticateJWT);
// Profile routes (Any authenticated user can access their own profile)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/password', updatePassword);
// User Management routes (Admin/Editor restricted)
router.get('/', getUsers);
router.post('/', authorizeRoles('admin', 'editor'), createUser);
router.put('/:id', authorizeRoles('admin', 'editor'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);
export default router;
