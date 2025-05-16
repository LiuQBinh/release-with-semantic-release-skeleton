// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { ICacheService } from './cache.interface';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisCacheService implements ICacheService, OnModuleInit, OnModuleDestroy {
//   private redisClient: Redis;

//   constructor() {
//     // Read Redis connection details from environment variables
//     const redisOptions = {
//       host: process.env.REDIS_HOST || 'localhost',
//       port: parseInt(process.env.REDIS_PORT || '6379'),
//       password: process.env.REDIS_PASSWORD,
//       db: parseInt(process.env.REDIS_DB || '0'),
//     };
    
//     this.redisClient = new Redis(redisOptions);
//   }

//   async onModuleInit() {
//     try {
//       // Test the connection
//       await this.redisClient.ping();
//       console.log('Redis connection established');
//     } catch (error) {
//       console.error('Failed to connect to Redis:', error);
//     }
//   }

//   async onModuleDestroy() {
//     // Close the Redis connection gracefully
//     await this.redisClient.quit();
//   }

//   /**
//    * Get a value from Redis by key
//    * @param key Cache key
//    * @returns The cached value or null if not found or expired
//    */
//   async get(key: string): Promise<any> {
//     const value = await this.redisClient.get(key);
//     if (!value) return null;
    
//     try {
//       return JSON.parse(value);
//     } catch (e) {
//       // If not JSON, return as is
//       return value;
//     }
//   }

//   /**
//    * Set a value in Redis
//    * @param key Cache key
//    * @param value Value to cache
//    * @param ttlSeconds Time to live in seconds (optional)
//    */
//   async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
//     const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    
//     if (ttlSeconds) {
//       await this.redisClient.set(key, serializedValue, 'EX', ttlSeconds);
//     } else {
//       await this.redisClient.set(key, serializedValue);
//     }
//   }

//   /**
//    * Delete a cache entry by key
//    * @param key Cache key
//    */
//   async delete(key: string): Promise<void> {
//     await this.redisClient.del(key);
//   }

//   /**
//    * Get all keys that start with a prefix
//    * @param prefix Key prefix
//    * @returns Array of matching keys
//    */
//   async getKeysByPrefix(prefix: string): Promise<string[]> {
//     return await this.redisClient.keys(`${prefix}*`);
//   }

//   /**
//    * Delete all cache entries with keys that start with a prefix
//    * @param prefix Key prefix
//    */
//   async deleteByPrefix(prefix: string): Promise<void> {
//     const keys = await this.getKeysByPrefix(prefix);
//     if (keys.length > 0) {
//       await this.redisClient.del(...keys);
//     }
//   }

//   /**
//    * Clear all cache entries (WARNING: this clears the entire Redis database)
//    */
//   async clear(): Promise<void> {
//     await this.redisClient.flushdb();
//   }
// } 