import { Request, Response, NextFunction } from 'express'
import { AuthTokenCacheService } from '../services/cache/token-cache.service'
import { ACCESS_TOKEN_COOKIE, AUTH_HEADER_NAME } from '../constants'

export interface AuthTokenMiddlewareOptions {
  skipPaths?: string[]
  errorHandler?: (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void
}

/**
 * Creates an Express middleware for token verification
 * This middleware can be used for token-based authentication in Express applications
 */
export function createAuthTokenMiddleware(
  tokenCacheService: AuthTokenCacheService,
  options: AuthTokenMiddlewareOptions = {},
) {
  const defaultErrorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    res.status(401).json({ error: 'Unauthorized', message: error.message })
  }

  const errorHandler = options.errorHandler || defaultErrorHandler

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Initialize auth header
      req.headers[AUTH_HEADER_NAME] = '{}'
      // Check if path should be skipped
      if (
        options.skipPaths &&
        shouldSkipVerification(req.path, options.skipPaths)
      ) {
        return next()
      }

      const token = extractToken(req)

      if (!token) {
        throw new Error('No token provided')
      }

      // Extract token signature
      const tokenSignature = tokenCacheService.extractSignature(token)

      // Verify token is in cache (whitelist)
      const userId = await tokenCacheService.isValidToken(tokenSignature)

      if (!userId) {
        throw new Error('Invalid token')
      }

      // Verify JWT structure (simple decode without verification to extract payload)
      const payload = decodeToken(token)

      if (!payload || payload.userId !== userId) {
        throw new Error('Invalid token payload')
      }

      // Set payload in request headers for downstream services
      req.headers[AUTH_HEADER_NAME] = JSON.stringify(payload)
      console.log('Token verified successfully', payload)
      next()
    } catch (error) {
      errorHandler(error, req, res, next)
    }
  }
}

function shouldSkipVerification(path: string, skipPaths: string[]): boolean {
  return skipPaths.some((skipPath) => {
    if (skipPath.endsWith('*')) {
      // Handle wildcard paths
      const prefix = skipPath.slice(0, -1)
      return path.startsWith(prefix)
    }
    return path === skipPath
  })
}

function extractToken(req: Request): string | null {
  // Try to extract from cookie
  if (req.cookies && req.cookies[ACCESS_TOKEN_COOKIE]) {
    return req.cookies[ACCESS_TOKEN_COOKIE]
  }

  // Try to extract from Authorization header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try to extract from query params (for WebSockets)
  if (req.query && req.query.token) {
    return req.query.token as string
  }

  return null
}

function decodeToken(token: string): any {
  try {
    // Basic JWT decoding (without verification)
    const [headerBase64, payloadBase64] = token.split('.')

    if (!headerBase64 || !payloadBase64) {
      return null
    }

    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8')
    return JSON.parse(payloadJson)
  } catch (error) {
    return null
  }
}
