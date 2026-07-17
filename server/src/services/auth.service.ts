import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/UserRepository.js';
import { sendResetPasswordEmail } from '../utils/email.service.js';
import { jwtConfig } from '../config/index.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Service class handling core authentication logic and flows.
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Registers a new user.
   */
  public async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError(MESSAGES.AUTH.EMAIL_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: ['viewer'],
    });

    return { userId: user.id };
  }

  /**
   * Authenticats user credentials and issues a JWT token.
   */
  public async login(data: { email: string; password?: string }) {
    if (!data.password) {
      throw new ValidationError('Password is required');
    }

    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AuthenticationError(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  /**
   * Generates a password reset token and sends an email.
   */
  public async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('No account found with that email address.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await this.userRepository.updateUser(user.id, {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiration
    });

    // LOGGING THE TOKEN FOR LOCAL TESTING (Replace with real email logic in production)
    console.log('-------------------------------------------');
    console.log(`🔑 PASSWORD RESET TOKEN FOR: ${email}`);
    console.log(`Token: ${resetToken}`);
    console.log(`Link: http://localhost:4200/auth/reset-password?token=${resetToken}`);
    console.log('-------------------------------------------');

    // SEND REAL EMAIL VIA SENDGRID
    await sendResetPasswordEmail(email, resetToken);
  }

  /**
   * Validates reset token and updates the password.
   */
  public async resetPassword(data: { token?: string; password?: string }): Promise<void> {
    if (!data.token || !data.password) {
      throw new ValidationError('Token and password are required');
    }

    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

    const user = await this.userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new ValidationError(MESSAGES.AUTH.TOKEN_INVALID);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.userRepository.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }
}
