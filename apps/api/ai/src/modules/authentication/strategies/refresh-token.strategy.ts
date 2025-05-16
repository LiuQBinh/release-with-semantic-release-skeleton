import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthTokenCacheService } from '@seconder/share/auth/services/cache/token-cache.service';
import { REFRESH_TOKEN_COOKIE } from '@seconder/share/auth/constants';
import { Request } from 'express';
import { UserService } from '../services/auth/user.service';
import { JWTAuthPayload } from '@seconder/share/auth/typing';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    private userService: UserService,
    private tokenCacheService: AuthTokenCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract token from cookie or request body
          return request?.cookies?.[REFRESH_TOKEN_COOKIE] || request?.body?.refresh_token;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JWTAuthPayload) {
    // Extract token from cookie or request body
    const token = request?.cookies?.[REFRESH_TOKEN_COOKIE] || request?.body?.refresh_token;
    
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // Extract token signature and check if it's in the cache (whitelist)
    const tokenSignature = this.tokenCacheService.extractSignature(token);
    const userId = await this.tokenCacheService.isValidToken(tokenSignature);

    if (!userId || userId !== payload.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user from database
    const user = await this.userService.findById(payload.userId);
    return { ...user, refreshToken: token };
  }
} 