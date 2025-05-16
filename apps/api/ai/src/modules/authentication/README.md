# Authentication Module

This module provides a comprehensive authentication system with the following features:

- Login with email and password
- Login with Google OAuth
- User registration with email verification
- Password management (forgot password, reset password, change password)
- Token management with JWT (refresh tokens, token revocation)
- Force logout from all devices

## Architecture

The module uses JWT tokens for authentication with an additional security layer:

- Token signatures are stored in cache (whitelist approach)
- Only tokens with signatures that exist in the cache are considered valid
- This allows for token revocation without waiting for token expiration

## Environment Variables

```
# JWT Configuration
JWT_SECRET=your-secret-key                  # Secret for signing access tokens
JWT_REFRESH_SECRET=your-refresh-secret-key  # Secret for signing refresh tokens

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8386/api/ai/v1/auth/google/callback # Must match Google Cloud Console configuration

# Email Configuration (for verification, password reset, etc.)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false                  # Use 'true' for TLS, typically with port 465
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@example.com      # Email address shown as the sender

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000  # Base URL of the frontend application for email links

# Cache Configuration
CACHE_STORE=file|redis  # Default: file. Determines where token signatures are stored.

# Redis Configuration (only required if CACHE_STORE=redis)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=             # Optional: Username if Redis requires authentication
REDIS_PASSWORD=             # Optional: Password if Redis requires authentication
REDIS_DB=0                  # Optional: Redis database index
```

It is recommended to manage these variables using `.env` files (e.g., `.env`, `.env.development`, `.env.production`).

## API Endpoints

**Public Endpoints:**

- `POST /api/ai/v1/auth/login` - Login with email and password
- `POST /api/ai/v1/auth/register` - Register a new user
- `POST /api/ai/v1/auth/refresh` - Refresh access token (Requires valid refresh token cookie)
- `GET /api/ai/v1/auth/google` - Initiate Google OAuth login flow
- `GET /api/ai/v1/auth/google/callback` - Google auth callback URL
- `POST /api/ai/v1/auth/verify-email` - Verify email with token from email link
- `POST /api/ai/v1/auth/forgot-password` - Request password reset email
- `POST /api/ai/v1/auth/reset-password` - Reset password with token from email link

**Authenticated Endpoints (Require valid Access Token):**

- `POST /api/ai/v1/auth/logout` - Logout current session
- `POST /api/ai/v1/auth/force-logout` - Logout from all sessions/devices
- `PUT /api/ai/v1/auth/change-password` - Change password for the logged-in user
- `GET /api/ai/v1/auth/me` - Get current authenticated user's information

## Authentication Flow

The authentication flow follows this pattern:

1. User logs in with credentials or Google OAuth
2. Server validates credentials and generates access and refresh tokens
3. Both tokens are stored in HTTP-only cookies
4. Token signatures are cached for validation and revocation
5. Access token is used for API access
6. When access token expires, refresh token is used to get a new access token
7. On logout, tokens are removed from cookies and cache

## Token Revocation

Tokens can be revoked in two ways:

1. Regular logout: Revokes the current access and refresh tokens
2. Force logout: Revokes all tokens for the user, forcing logout across all devices

## Cache Configuration

The module supports two cache implementations for storing token signatures, configured via the `CACHE_STORE` environment variable:

1. **FileCacheService** (default, `CACHE_STORE=file`): Uses a file-based cache that stores data in `cache` directory.
2. **RedisCacheService** (`CACHE_STORE=redis`): Uses Redis for caching. Configure connection parameters using `REDIS_*` environment variables.

Using Redis is recommended for production as it provides:
- Persistence across application restarts
- Shared cache for distributed systems
- Better scalability and reliability

The cache implementation details can be found within the `services/cache/` directory. 
