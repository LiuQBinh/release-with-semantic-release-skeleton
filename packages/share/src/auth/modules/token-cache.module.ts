import { Module } from '@nestjs/common'
import { AuthCacheServiceProvider } from '../services/cache/cache.provider'
import { AuthTokenCacheService } from '../services/cache/token-cache.service'

@Module({
  providers: [AuthCacheServiceProvider, AuthTokenCacheService],
  exports: [AuthCacheServiceProvider, AuthTokenCacheService],
})
export class AuthenticationTokenCacheModule {}
