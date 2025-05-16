import { Injectable, Inject } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { ICacheService } from '../../../interfaces/cache.interface'
import { CACHE_SERVICE } from './cache.provider'
import { TOKEN_CACHE_PREFIX } from '../../constants'

@Injectable()
export class AuthTokenCacheService {
  constructor(@Inject(CACHE_SERVICE) private cacheService: ICacheService) {}

  /**
   * Store a token in the cache with user-specific key
   * @param userId User ID associated with the token
   * @param tokenSignature The signature part of the JWT token
   * @param ttl Time to live in seconds
   */
  async storeToken(
    userId: string,
    tokenSignature: string,
    ttl: number,
  ): Promise<void> {
    // Store token with user-specific prefix for efficient revocation
    await this.cacheService.set(
      `user:${userId}:${TOKEN_CACHE_PREFIX}${tokenSignature}`,
      userId,
      ttl,
    )

    // Also store a lookup map to find token by signature alone (for validation)
    await this.cacheService.set(
      `${TOKEN_CACHE_PREFIX}${tokenSignature}`,
      userId,
      ttl,
    )
  }

  /**
   * Check if a token is valid (exists in the cache)
   * @param tokenSignature The signature part of the JWT token
   * @returns The user ID if valid, null otherwise
   */
  async isValidToken(tokenSignature: string): Promise<string | null> {
    return await this.cacheService.get(`${TOKEN_CACHE_PREFIX}${tokenSignature}`)
  }

  /**
   * Remove a token from the cache
   * @param tokenSignature The signature part of the JWT token
   */
  async revokeToken(tokenSignature: string): Promise<void> {
    // Get the user ID first
    const userId = await this.isValidToken(tokenSignature)

    if (userId) {
      // Delete from both locations
      await this.cacheService.delete(`${TOKEN_CACHE_PREFIX}${tokenSignature}`)
      await this.cacheService.delete(
        `user:${userId}:${TOKEN_CACHE_PREFIX}${tokenSignature}`,
      )
    }
  }

  /**
   * Remove all tokens for a user
   * @param userId User ID
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    const userTokenKeys = await this.cacheService.getKeysByPrefix(
      `user:${userId}:${TOKEN_CACHE_PREFIX}`,
    )
    const keys = userTokenKeys.map((key) => key.replace(`user:${userId}:`, ''))

    const allKeys = [...new Set([...userTokenKeys, ...keys])] // Ensure uniqueness

    if (allKeys.length > 0) {
      await Promise.all(allKeys.map((key) => this.cacheService.delete(key)))
    }
  }

  /**
   * Extract the signature part from a JWT token
   * @param token The JWT token
   * @returns The signature part
   */
  extractSignature(token: string): string {
    const parts = token.split('.')
    return parts.length === 3 ? parts[2] : ''
  }

  /**
   * Generate a unique token ID
   * @returns UUID string
   */
  generateTokenId(): string {
    return uuidv4()
  }
}
