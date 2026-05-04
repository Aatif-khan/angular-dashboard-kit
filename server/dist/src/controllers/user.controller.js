import { prisma } from '../index.js';
import bcrypt from 'bcryptjs';
import { catchAsync, AppError } from '../utils/error.handler.js';
export const getUsers = catchAsync(async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true,
            createdAt: true
        }
    });
    res.json(users);
});
export const createUser = catchAsync(async (req, res) => {
    const { email, password, firstName, lastName, roles } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'default123', 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            roles: roles || ['viewer']
        }
    });
    res.status(201).json(user);
});
export const updateUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, roles } = req.body;
    const user = await prisma.user.update({
        where: { id: id },
        data: { email, firstName, lastName, roles }
    });
    res.json(user);
});
export const deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: id } });
    res.json({ message: 'User deleted successfully' });
});
export const getProfile = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true
        }
    });
    if (!user) {
        throw new AppError('User not found', 404);
    }
    res.json(user);
});
export const updateProfile = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const { firstName, lastName, email } = req.body;
    const user = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, email },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roles: true
        }
    });
    res.json(user);
});
export const updatePassword = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new AppError('User not found', 404);
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
    res.json({ message: 'Password updated successfully' });
});
