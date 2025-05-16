import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { AuthTokenCacheService } from '@seconder/share/auth/services/cache/token-cache.service';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '@seconder/share/auth/constants';
import { ConfigService } from '@nestjs/config';
import { JWTAuthPayload } from '@seconder/share/auth/typing';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private jwtService: JwtService,
    private tokenCacheService: AuthTokenCacheService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || '';
    this.jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || '';
  }

  /**
   * Convert milliseconds to seconds for JWT expiry
   * @param ms Milliseconds
   * @returns Seconds for JWT
   */
  private msToJwtExpiry(ms: number): number {
    return Math.floor(ms / 1000);
  }

  /**
   * Generate JWT tokens for a user
   * @param user User
   * @returns Access and refresh tokens
   */
  async generateTokens(user: User): Promise<TokenPair> {
    const jti = this.tokenCacheService.generateTokenId();
    
    const accessPayload: JWTAuthPayload = { 
      userId: user._id.toString(), 
      email: user.email,
      jti: `access-${jti}`
    };
    
    const refreshPayload: JWTAuthPayload = { 
      userId: user._id.toString(), 
      email: user.email,
      jti: `refresh-${jti}`
    };
    
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: this.msToJwtExpiry(ACCESS_TOKEN_EXPIRATION),
      secret: this.jwtSecret,
    });
    
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: this.msToJwtExpiry(REFRESH_TOKEN_EXPIRATION),
      secret: this.jwtRefreshSecret,
    });

    // Store tokens in cache for validation and revocation
    const accessTokenSignature = this.tokenCacheService.extractSignature(accessToken);
    const refreshTokenSignature = this.tokenCacheService.extractSignature(refreshToken);
    
    // Convert expiry to seconds for cache
    await this.tokenCacheService.storeToken(
      user._id.toString(), 
      accessTokenSignature,
      Math.floor(ACCESS_TOKEN_EXPIRATION / 1000) // Convert ms to seconds
    ); 
    
    await this.tokenCacheService.storeToken(
      user._id.toString(), 
      refreshTokenSignature,
      Math.floor(REFRESH_TOKEN_EXPIRATION / 1000) // Convert ms to seconds
    );

    return { accessToken, refreshToken };
  }

  /**
   * Validate a refresh token
   * @param token Refresh token
   * @returns User ID if valid
   */
  async validateRefreshToken(token: string): Promise<JWTAuthPayload> {
    try {
      const decoded = this.jwtService.verify<JWTAuthPayload>(token, {
        secret: this.jwtRefreshSecret,
      });

      const tokenSignature = this.tokenCacheService.extractSignature(token);
      const userId = await this.tokenCacheService.isValidToken(tokenSignature);

      if (!userId || userId !== decoded.userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken Refresh token
   * @returns New access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const {userId, email} = await this.validateRefreshToken(refreshToken);
    
    // Create a new access token
    const jti = this.tokenCacheService.generateTokenId();
    
    const accessPayload: JWTAuthPayload = { 
      userId: userId,
      email: email, 
      jti: `access-${jti}`
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: this.msToJwtExpiry(ACCESS_TOKEN_EXPIRATION),
      secret: this.jwtSecret,
    });

    const accessTokenSignature = this.tokenCacheService.extractSignature(accessToken);
    await this.tokenCacheService.storeToken(
      userId, 
      accessTokenSignature, 
      Math.floor(ACCESS_TOKEN_EXPIRATION / 1000) // Convert ms to seconds
    );
    
    return { accessToken };
  }

  /**
   * Revoke tokens for logout
   * @param accessToken Access token
   * @param refreshToken Refresh token
   */
  async revokeTokens(accessToken?: string, refreshToken?: string): Promise<void> {
    if (accessToken) {
      const accessTokenSignature = this.tokenCacheService.extractSignature(accessToken);
      await this.tokenCacheService.revokeToken(accessTokenSignature);
    }
    
    if (refreshToken) {
      const refreshTokenSignature = this.tokenCacheService.extractSignature(refreshToken);
      await this.tokenCacheService.revokeToken(refreshTokenSignature);
    }
  }

  /**
   * Force logout user from all devices
   * @param userId User ID
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.tokenCacheService.revokeAllUserTokens(userId);
  }
} 