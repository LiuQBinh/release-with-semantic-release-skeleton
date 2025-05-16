import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from '../../dto/auth.dto';
import { UserService } from './user.service';
import { EmailService } from '../email/email.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class RegistrationService {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  /**
   * Register a new user
   * @param registerDto Registration data
   * @returns Created user
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.userService.create(email, password, firstName, lastName);
    
    if (!user.emailVerificationToken) {
      throw new InternalServerErrorException('Failed to generate verification token');
    }
    
    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, user.emailVerificationToken);
    } catch (error) {
      // Log the error but don't fail the registration
      console.error('Failed to send verification email:', error);
    }
    
    return user;
  }

  /**
   * Verify email with token
   * @param token Verification token
   * @returns Success message
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userService.verifyEmail(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }
    return { message: 'Email verified successfully' };
  }

  /**
   * Initiate password reset
   * @param email User email
   * @returns Success message
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Return success message even if user doesn't exist for security
      return { message: 'Password reset email sent' };
    }

    const updatedUser = await this.userService.setPasswordResetToken(user);
    
    if (!updatedUser.passwordResetToken) {
      throw new InternalServerErrorException('Failed to generate password reset token');
    }
    
    try {
      await this.emailService.sendPasswordResetEmail(email, updatedUser.passwordResetToken);
    } catch (error) {
      // Log the error but don't expose it to the user
      console.error('Failed to send password reset email:', error);
    }
    
    return { message: 'Password reset email sent' };
  }

  /**
   * Reset password with token
   * @param token Reset token
   * @param newPassword New password
   * @returns Success message
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.userService.resetPassword(user, newPassword);
    return { message: 'Password reset successful' };
  }
} 