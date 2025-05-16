import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './services/auth/user.service';
import { TokenService, TokenPair } from './services/auth/token.service';
import { RegistrationService } from './services/auth/registration.service';
import { ChangePasswordDto, RegisterDto } from './dto/auth.dto';
import { SocialAuthService } from './services/auth/social-auth.service';
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_COOKIE,
} from './constants/auth.constants';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private registrationService: RegistrationService,
    private socialAuthService: SocialAuthService,
  ) {}

  /**
   * Validate user credentials
   * @param email User email
   * @param password User password
   * @returns User if valid, null otherwise
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );

    return isPasswordValid ? user : null;
  }

  /**
   * Generate tokens for an already validated user
   * @param user Validated user object
   * @returns Access and refresh tokens
   */
  async generateTokensForUser(user: User): Promise<TokenPair> {
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    return this.tokenService.generateTokens(user);
  }

  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   * @returns User and tokens
   */
  async login(email: string, password: string): Promise<{ user: User; tokens: TokenPair }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }

  /**
   * Register a new user
   * @param registerDto Registration data
   * @returns Created user
   */
  async register(registerDto: RegisterDto): Promise<User> {
    return this.registrationService.register(registerDto);
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken Refresh token
   * @returns New access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return this.tokenService.refreshToken(refreshToken);
  }

  /**
   * Verify email with token
   * @param token Verification token
   * @returns Success message
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.registrationService.verifyEmail(token);
  }

  /**
   * Initiate password reset
   * @param email User email
   * @returns Success message
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.registrationService.forgotPassword(email);
  }

  /**
   * Reset password with token
   * @param token Reset token
   * @param newPassword New password
   * @returns Success message
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.registrationService.resetPassword(token, newPassword);
  }

  /**
   * Change password
   * @param userId User ID
   * @param changePasswordDto Password change data
   * @returns Success message
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.userService.findById(userId);
    
    const isPasswordValid = await this.userService.validatePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.userService.changePassword(userId, newPassword);
    return { message: 'Password changed successfully' };
  }

  /**
   * Login or register with Google
   * @param email User email
   * @param googleId Google ID
   * @returns User and tokens
   */
  async googleLogin(email: string, googleId: string, displayName: string): Promise<{ user: User; tokens: TokenPair }> {
    return this.socialAuthService.googleLogin(email, googleId, displayName);
  }

  /**
   * Logout user by revoking their tokens
   * @param accessToken Access token
   * @param refreshToken Refresh token
   * @returns Success message
   */
  async logout(accessToken: string, refreshToken: string): Promise<{ message: string }> {
    await this.tokenService.revokeTokens(accessToken, refreshToken);
    return { message: 'Logged out successfully' };
  }

  /**
   * Force logout user from all devices
   * @param userId User ID
   * @returns Success message
   */
  async forceLogout(userId: string): Promise<{ message: string }> {
    await this.tokenService.revokeAllUserTokens(userId);
    return { message: 'Logged out from all devices' };
  }

  /**
   * Helper function to set auth cookies
   */
  setCookies(res: any, accessToken: string, refreshToken: string) {
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.ENV === 'production',
      maxAge: ACCESS_TOKEN_EXPIRATION,
    });
    
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.ENV === 'production',
      maxAge: REFRESH_TOKEN_EXPIRATION,
    });
  }
}