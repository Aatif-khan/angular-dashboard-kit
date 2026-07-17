import { User, Prisma } from '@prisma/client';
import { BaseRepository } from './BaseRepository.js';
import { prisma } from '../config/index.js';

/**
 * Repository class handling database operations for the User model.
 */
export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super(prisma.user);
  }

  /**
   * Find a user by their unique email.
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their unique ID.
   */
  public override async findById(id: string): Promise<User | null> {
    return super.findById(id);
  }

  /**
   * Create a new user record.
   */
  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.create(data);
  }

  /**
   * Update an existing user record.
   */
  public async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.update(id, data);
  }

  /**
   * Delete a user record.
   */
  public async deleteUser(id: string): Promise<User> {
    return this.delete(id);
  }

  /**
   * Find a user by their unexpired password reset token.
   */
  public async findByResetToken(token: string): Promise<User | null> {
    return this.model.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });
  }

  /**
   * Find all users projecting only non-sensitive fields.
   */
  public async findAll(): Promise<Partial<User>[]> {
    return this.model.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        createdAt: true,
      },
    });
  }

  /**
   * Find a user profile projecting non-sensitive fields.
   */
  public async findProfileById(id: string): Promise<Partial<User> | null> {
    return this.model.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
      },
    });
  }

  /**
   * Update profile fields projecting non-sensitive fields.
   */
  public async updateProfile(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<Partial<User>> {
    return this.model.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
      },
    });
  }
}
