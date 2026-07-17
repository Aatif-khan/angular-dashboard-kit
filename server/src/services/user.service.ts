import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Service class handling core business logic for users.
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Retrieves all users.
   */
  public async getUsers() {
    return this.userRepository.findAll();
  }

  /**
   * Creates a new user.
   */
  public async createUser(data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    roles?: string[];
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError(MESSAGES.AUTH.EMAIL_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(data.password || 'default123', 10);
    return this.userRepository.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || ['viewer'],
    });
  }

  /**
   * Updates an existing user by ID.
   */
  public async updateUser(
    id: string,
    data: { email?: string; firstName?: string; lastName?: string; roles?: string[] }
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    return this.userRepository.updateUser(id, data);
  }

  /**
   * Deletes a user by ID.
   */
  public async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    return this.userRepository.deleteUser(id);
  }

  /**
   * Retrieves a user profile by ID.
   */
  public async getProfile(userId: string) {
    const user = await this.userRepository.findProfileById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    return user;
  }

  /**
   * Updates a user profile.
   */
  public async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; email?: string }
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }
    return this.userRepository.updateProfile(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
  }

  /**
   * Updates a user password.
   */
  public async updatePassword(
    userId: string,
    data: { currentPassword?: string; newPassword?: string }
  ): Promise<void> {
    if (!data.currentPassword || !data.newPassword) {
      throw new ValidationError('Current password and new password are required');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.updateUser(userId, {
      password: hashedPassword,
    });
  }
}
