/**
 * Authentication related constants
 */

// Cookie names
export const ACCESS_TOKEN_COOKIE = 'at';
export const REFRESH_TOKEN_COOKIE = 'rt';

// Token expiration times (in milliseconds)
export const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15 minutes
export const REFRESH_TOKEN_EXPIRATION = 365 * 24 * 60 * 60 * 1000; // 365 days 

// Cache configuration
export const TOKEN_CACHE_PREFIX = 'token:';