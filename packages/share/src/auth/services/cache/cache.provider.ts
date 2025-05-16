import { Provider } from '@nestjs/common';
import { FileCacheService } from '../../../services/cache/file-cache.service';
// import { RedisCacheService } from './redis-cache.service';

/**
 * Token for dependency injection of the cache service
 */
export const CACHE_SERVICE = 'CACHE_SERVICE';

/**
 * Provider that determines which cache implementation to use based on environment variables
 */
export const AuthCacheServiceProvider: Provider = {
  provide: CACHE_SERVICE,
  useFactory: () => {
    const cacheType = process.env.CACHE_TYPE || 'file';
    
    switch (cacheType.toLowerCase()) {
      // case 'redis':
      //   return new RedisCacheService();
      case 'file':
      default:
        return new FileCacheService();
    }
  }
}; 