import { Router } from 'express';
import { login, register, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login as any);
router.post('/register', register as any);
router.post('/forgot-password', forgotPassword as any);
router.post('/reset-password', resetPassword as any);

export default router;
