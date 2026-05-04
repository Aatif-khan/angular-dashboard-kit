import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../index.js';
import { catchAsync, AppError } from '../utils/error.handler.js';
export const register = catchAsync(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError('Email is already in use', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            roles: ['viewer']
        }
    });
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
});
export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid email or password', 401);
    }
    const token = jwt.sign({ id: user.id, email: user.email, roles: user.roles }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles
        }
    });
});
export const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // We send success even if user doesn't exist for security (prevent email enumeration)
        return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken: hashedToken,
            resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour
        }
    });
    // LOGGING THE TOKEN FOR LOCAL TESTING (Replace with real email logic in production)
    console.log('-------------------------------------------');
    console.log(`🔑 PASSWORD RESET TOKEN FOR: ${email}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Link: http://localhost:4200/auth/reset-password?token=${resetToken}`);
    console.log('-------------------------------------------');
    res.json({ message: 'Reset link sent to email.' });
});
export const resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
        where: {
            resetToken: hashedToken,
            resetTokenExpiry: { gt: new Date() }
        }
    });
    if (!user) {
        throw new AppError('Token is invalid or has expired', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });
    res.json({ message: 'Password has been reset successfully.' });
});
