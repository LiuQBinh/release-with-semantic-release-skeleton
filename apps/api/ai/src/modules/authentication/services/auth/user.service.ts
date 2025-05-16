import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Find a user by email
   * @param email User email
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @returns User or throws NotFoundException
   */
  async findById(id: string): Promise<User> {
    const objectId = new ObjectId(id);
    const user = await this.userRepository.findOneBy({ _id: objectId });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Create a new user
   * @param email User email
   * @param password User password (plain text)
   * @returns Created user
   */
  async create(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const verificationToken = uuidv4();

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      isEmailVerified: false,
      firstName,
      lastName,
    });

    return this.userRepository.save(user);
  }

  /**
   * Create a user from Google OAuth
   * @param email User email
   * @param googleId Google ID
   * @returns Created user
   */
  async createFromGoogle(email: string, googleId: string, displayName: string): Promise<User> {
    const user = this.userRepository.create({
      email,
      googleId,
      isEmailVerified: true, // Google accounts are considered verified
      firstName: displayName.split(' ')[0],
      lastName: displayName.split(' ')[1],
    });

    return this.userRepository.save(user);
  }

  /**
   * Verify a user's email
   * @param token Verification token
   * @returns Updated user or null if token invalid
   */
  async verifyEmail(token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
      where: { emailVerificationToken: token } 
    });

    if (!user) {
      return null;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;

    return this.userRepository.save(user);
  }

  /**
   * Set password reset token
   * @param user User
   * @returns Updated user with reset token
   */
  async setPasswordResetToken(user: User): Promise<User> {
    const resetToken = uuidv4();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expiry;

    return this.userRepository.save(user);
  }

  /**
   * Find user by reset token
   * @param token Reset token
   * @returns User or null if token invalid/expired
   */
  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
      where: { passwordResetToken: token } 
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return null;
    }

    return user;
  }

  /**
   * Reset user password
   * @param user User
   * @param newPassword New password
   * @returns Updated user
   */
  async resetPassword(user: User, newPassword: string): Promise<User> {
    user.password = await this.hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    return this.userRepository.save(user);
  }

  /**
   * Change user password
   * @param userId String
   * @param newPassword New password
   * @returns Updated user
   */
  async changePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    user.password = await this.hashPassword(newPassword);

    return this.userRepository.save(user);
  }

  /**
   * Validate user password
   * @param plainPassword Plain text password
   * @param hashedPassword Hashed password from database
   * @returns True if password is valid
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Hash a password
   * @param password Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Update user data
   * @param user User with updated fields
   * @returns Updated user
   */
  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
} 