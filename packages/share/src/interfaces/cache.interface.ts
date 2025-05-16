/**
 * Interface for cache service implementations
 * This allows for different cache backends (file, redis, memory, etc.)
 */
export interface ICacheService {
  /**
   * Get a value from the cache by key
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time to live in seconds (optional)
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>

  /**
   * Delete a cache entry by key
   * @param key Cache key
   */
  delete(key: string): Promise<void>

  /**
   * Get all keys that start with a prefix
   * @param prefix Key prefix
   * @returns Array of matching keys
   */
  getKeysByPrefix(prefix: string): Promise<string[]>

  /**
   * Delete all cache entries with keys that start with a prefix
   * @param prefix Key prefix
   */
  deleteByPrefix(prefix: string): Promise<void>
}
