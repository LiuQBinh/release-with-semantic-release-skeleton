import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenAuthGuard } from './guards/refreshtoken-auth.guard';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_EXPIRATION,
} from './constants/auth.constants';

/**
 * Authentication controller handling user authentication operations
 */
@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  /**
   * Login endpoint
   */
  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    // The user is already validated by the AuthGuard('local')
    const tokens = await this.authService.generateTokensForUser(req.user);

    // Set cookies
    this.authService.setCookies(res, tokens.accessToken, tokens.refreshToken);

    // Filter sensitive user data
    const { password, ...result } = req.user;
    return { user: result, message: 'Login successful' };
  }

  /**
   * Register endpoint
   */
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    
    // Filter sensitive user data
    const { password, emailVerificationToken, ...result } = user;
    return { 
      user: result, 
      message: 'Registration successful. Please check your email to verify your account.'
    };
  }

  /**
   * Token refresh endpoint
   */
  @Post('refresh')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(RefreshTokenAuthGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] || req.body?.refresh_token;
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }
    
    const { accessToken } = await this.authService.refreshToken(refreshToken);
    
    // Update only the access token cookie
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.ENV === 'production',
      maxAge: ACCESS_TOKEN_EXPIRATION,
    });
    
    return { message: 'Token refreshed successfully' };
  }

  /**
   * Logout endpoint
   */
  @Post('logout')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE];
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    
    await this.authService.logout(accessToken, refreshToken);
    
    // Clear cookies
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    
    return { message: 'Logout successful' };
  }

  /**
   * Force logout endpoint
   */
  @Post('force-logout')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Force logout from all devices' })
  async forceLogout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.forceLogout(req.user._id);
    
    // Clear cookies
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    
    return { message: 'Logged out from all devices' };
  }

  /**
   * Google authentication initiation
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  googleAuth() {
    // This route will redirect to Google
  }

  /**
   * Google authentication callback
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google auth callback' })
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { email, googleId, displayName } = req.user;
    
    const { tokens } = await this.authService.googleLogin(email, googleId, displayName);
    
    // Set cookies
    this.authService.setCookies(res, tokens.accessToken, tokens.refreshToken);
    
    // Redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(frontendUrl);
  }

  /**
   * Email verification endpoint
   */
  @Post('verify-email')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiBody({ type: VerifyEmailDto })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  /**
   * Forgot password endpoint
   */
  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * Reset password endpoint
   */
  @Post('reset-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  /**
   * Change password endpoint
   */
  @Put('change-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password (authenticated)' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user._id, changePasswordDto);
  }

  /**
   * Get current user profile
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user info' })
  getProfile(@Req() req) {
    // Filter sensitive user data
    const { password, ...result } = req.user;
    return result;
  }
} 