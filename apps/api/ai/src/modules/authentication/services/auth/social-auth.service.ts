import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UserService } from './user.service';
import { TokenService, TokenPair } from './token.service';

export interface GoogleProfile {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  /**
   * Handle Google authentication
   * @param email User email
   * @param googleId Google ID
   * @returns User and tokens
   */
  async googleLogin(email: string, googleId: string, displayName: string): Promise<{ user: User; tokens: TokenPair }> {
    try {
      if (!email) {
        throw new UnauthorizedException('Google account must have an email address');
      }

      // Try to find user by email
      let user = await this.userService.findByEmail(email);
      
      if (!user) {
        // Create new user if not found
        user = await this.userService.createFromGoogle(email, googleId, displayName);
        this.logger.log(`Created new user from Google login: ${email}`);
      } else if (!user.googleId) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.isEmailVerified = true; // Mark as verified since Google accounts are verified
        user = await this.userService.updateUser(user);
        this.logger.log(`Linked existing user to Google account: ${email}`);
      }

      // Generate tokens
      const tokens = await this.tokenService.generateTokens(user);
      return { user, tokens };
    } catch (error) {
      this.logger.error(
        `Error authenticating with Google: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
} 