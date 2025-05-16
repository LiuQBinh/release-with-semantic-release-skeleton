import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ICacheService } from '../../interfaces/cache.interface';
import { existsSync, mkdirSync } from 'fs';

interface CacheEntry<T> {
  value: T;
  expiry: number | null; // null means no expiration
  key: string; // Store the original key
}

@Injectable()
export class FileCacheService implements ICacheService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FileCacheService.name);
  private cacheDir: string;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour default

  constructor() {
    this.cacheDir = process.env.CACHE_DIR || '/tmp/seconder/auth/sessions';
    this.ensureCacheDirectory();
  }

  /**
   * Initialize cleanup task when module starts
   */
  onModuleInit(): void {
    this.startCleanupTask();
  }

  /**
   * Clean up resources when module is destroyed
   */
  onModuleDestroy(): void {
    this.stopCleanupTask();
  }

  /**
   * Start the periodic cleanup task
   */
  private startCleanupTask(): void {
    this.logger.log(`Starting cache cleanup task (interval: ${this.CLEANUP_INTERVAL_MS}ms)`);
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries().catch(err => {
        this.logger.error(`Error in cache cleanup task: ${err.message}`);
      });
    }, this.CLEANUP_INTERVAL_MS);
  }

  /**
   * Stop the periodic cleanup task
   */
  private stopCleanupTask(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      this.logger.log('Stopped cache cleanup task');
    }
  }

  /**
   * Clean up expired cache entries
   */
  private async cleanupExpiredEntries(): Promise<void> {
    this.logger.log('Running cache cleanup task');
    const now = Date.now();
    
    try {
      // Get all cache files
      const files = await this.listFilesRecursively(this.cacheDir);
      let expiredCount = 0;
      
      // Process files in batches to avoid memory issues
      const batchSize = 100;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (filePath) => {
          try {
            const data = await fs.readFile(filePath, 'utf8');
            const entry = JSON.parse(data) as CacheEntry<unknown>;
            
            if (entry.expiry !== null && entry.expiry < now) {
              await fs.unlink(filePath);
              expiredCount++;
            }
          } catch (err) {
            // Skip invalid files
            this.logger.warn(`Error processing file ${filePath} during cleanup: ${err.message}`);
          }
        }));
      }
      
      this.logger.log(`Cache cleanup completed: ${expiredCount} expired entries removed`);
    } catch (err) {
      this.logger.error(`Failed to clean up cache: ${err.message}`);
    }
  }

  /**
   * Ensure the cache directory exists
   */
  private ensureCacheDirectory(): void {
    try {
      if (!existsSync(this.cacheDir)) {
        mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch (error) {
      this.logger.error(`Failed to create cache directory: ${error.message}`);
    }
  }

  /**
   * Convert cache key to file path
   * Handles colon separators as directory structure
   * @param key Cache key
   * @returns Full file path
   */
  private keyToFilePath(key: string): string {
    // Split by colons
    const parts = key.split(':');
    
    // If there's only one part, return a direct file
    if (parts.length === 1) {
      return path.join(this.cacheDir, key);
    }
    
    // Last part is the filename, rest are directories
    const filename = parts.pop() as string;
    const directories = parts;
    
    // Build the directory path
    const dirPath = path.join(this.cacheDir, ...directories);
    
    // Return the full path
    return path.join(dirPath, filename);
  }

  /**
   * Get directory path for a key prefix
   * @param prefix Key prefix
   * @returns Directory path
   */
  private keyPrefixToDirectoryPath(prefix: string): string {
    // If prefix ends with colon, it directly maps to a directory
    if (prefix.endsWith(':')) {
      const directoryKey = prefix.slice(0, -1); // Remove trailing colon
      return path.dirname(this.keyToFilePath(directoryKey + 'dummy'));
    }
    
    // Otherwise, get the directory containing matching files
    return path.dirname(this.keyToFilePath(prefix + 'dummy'));
  }

  /**
   * Ensure the directory for a file path exists
   * @param filePath Full file path
   */
  private async ensureDirectoryExists(filePath: string): Promise<void> {
    const directory = path.dirname(filePath);
    try {
      await fs.mkdir(directory, { recursive: true });
    } catch (error) {
      // Ignore if directory already exists
      if (error.code !== 'EEXIST') {
        this.logger.error(`Failed to create directory ${directory}: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Read a cache entry directly from disk
   * @param key Cache key
   * @returns The cache entry or null if not found
   */
  private async readFromDisk<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const filePath = this.keyToFilePath(key);
      console.log('filePath', filePath);
      // Check if file exists before attempting to read
      try {
        await fs.access(filePath);
      } catch {
        return null;
      }
      
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as CacheEntry<T>;
    } catch (err) {
      this.logger.warn(`Error reading cache file for key ${key}: ${err.message}`);
      return null;
    }
  }

  /**
   * Save the cache entry to disk with retry mechanism
   */
  private async saveToDisk<T>(key: string, entry: CacheEntry<T>, retries = 3): Promise<void> {
    try {
      const filePath = this.keyToFilePath(key);
      
      // Ensure directory exists before writing
      await this.ensureDirectoryExists(filePath);
      
      const data = JSON.stringify(entry);
      await fs.writeFile(filePath, data);
    } catch (err) {
      this.logger.warn(`Error saving cache entry for key ${key}: ${err.message}`);
      
      // Retry with backoff if retries remain
      if (retries > 0) {
        const delay = Math.pow(2, 3 - retries) * 100; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.saveToDisk(key, entry, retries - 1);
      }
      
      this.logger.error(`Failed to save cache to disk after retries for key ${key}`);
    }
  }

  /**
   * Get a value from the cache by key
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  async get<T>(key: string): Promise<T | null> {
    // Read directly from disk
    const entry = await this.readFromDisk<T>(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if the entry has expired
    if (entry.expiry !== null && entry.expiry < Date.now()) {
      await this.delete(key).catch(err => {
        this.logger.warn(`Error deleting expired key ${key}: ${err.message}`);
      });
      return null;
    }
    
    return entry.value;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time to live in seconds (optional)
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
      expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
      key,
    };
    
    await this.saveToDisk(key, entry);
  }

  /**
   * Delete a cache entry by key
   * @param key Cache key
   */
  async delete(key: string): Promise<void> {
    try {
      const filePath = this.keyToFilePath(key);
      await fs.unlink(filePath).catch(() => {
        // Ignore if file doesn't exist
      });
    } catch (err) {
      this.logger.warn(`Error deleting cache key ${key}: ${err.message}`);
    }
  }

  /**
   * List all files in a directory recursively
   * @param directory Directory path
   * @returns Array of file paths
   */
  private async listFilesRecursively(directory: string): Promise<string[]> {
    const result: string[] = [];
    
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      await Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.listFilesRecursively(fullPath);
          result.push(...subFiles);
        } else {
          result.push(fullPath);
        }
      }));
    } catch (err) {
      // Directory might not exist yet
      if (err.code !== 'ENOENT') {
        this.logger.warn(`Error listing directory ${directory}: ${err.message}`);
      }
    }
    
    return result;
  }

  /**
   * Convert file path back to cache key
   * @param filePath File path
   * @returns Cache key
   */
  private filePathToKey(filePath: string): string {
    // Get relative path to cache dir
    const relPath = path.relative(this.cacheDir, filePath);
    
    // Convert path separators to colons
    return relPath.replace(/[\/\\]/g, ':');
  }

  /**
   * Get all keys that start with a prefix
   * @param prefix Key prefix
   * @returns Array of matching keys
   */
  async getKeysByPrefix(prefix: string): Promise<string[]> {
    const directory = this.keyPrefixToDirectoryPath(prefix);
    
    try {
      const files = await this.listFilesRecursively(directory);
      const keys = files.map(file => this.filePathToKey(file));
      
      // Filter keys that actually match the prefix
      // This is necessary because we're querying by directory
      return keys.filter(key => key.startsWith(prefix));
    } catch (err) {
      this.logger.warn(`Error getting keys by prefix ${prefix}: ${err.message}`);
      return [];
    }
  }

  /**
   * Delete all cache entries with keys that start with a prefix
   * @param prefix Key prefix
   */
  async deleteByPrefix(prefix: string): Promise<void> {
    const keys = await this.getKeysByPrefix(prefix);
    
    if (keys.length > 0) {
      await Promise.all(keys.map(key => this.delete(key)));
    }
  }
} 