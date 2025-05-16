import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserService } from './services/auth/user.service';
import { TokenService } from './services/auth/token.service';
import { RegistrationService } from './services/auth/registration.service';
import { SocialAuthService } from './services/auth/social-auth.service';
import { EmailService } from './services/email/email.service';
import { AuthenticationTokenCacheModule } from '@seconder/share/auth/modules/token-cache.module';

import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

import { User } from './entities/user.entity';


@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    AuthenticationTokenCacheModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    // Main services
    AuthenticationService,
    UserService,
    TokenService,
    RegistrationService,
    SocialAuthService,
    EmailService,
    
    // Strategies
    LocalStrategy,
    GoogleStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthenticationService, UserService],
})
export class AuthenticationModule {}

// Module entry point for dynamic loading
export default AuthenticationModule; 