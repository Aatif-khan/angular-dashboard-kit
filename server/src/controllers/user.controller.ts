import { Request, Response } from 'express';
import { prisma } from '../index.js';
import bcrypt from 'bcryptjs';
import { catchAsync, AppError } from '../utils/error.handler.js';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
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

export const createUser = catchAsync(async (req: Request, res: Response) => {
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

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, firstName, lastName, roles } = req.body;
  
  const user = await prisma.user.update({
    where: { id: id as string },
    data: { email, firstName, lastName, roles }
  });
  
  res.json(user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.user.delete({ where: { id: id as string } });
  
  res.json({ message: 'User deleted successfully' });
});
