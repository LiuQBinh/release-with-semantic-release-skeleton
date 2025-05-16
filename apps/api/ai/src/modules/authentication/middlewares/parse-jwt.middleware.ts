import { NextFunction, Request, Response } from 'express';

// Use the same header as JwtAuthGuard
const AuthHeaderName = 'au-payload';

/**
 * Middleware to parse JWT-like payload from header and attach to req.user.
 * Does NOT throw if missing or invalid.
 */
export function ParseJwtPayloadMiddleware(req: Request, res: Response, next: NextFunction) {
  const authenticatedPayload = req.headers[AuthHeaderName] as string | undefined;
  if (authenticatedPayload) {
    try {
      const payload = JSON.parse(authenticatedPayload);
      req.user = {
        _id: payload.userId,
        email: payload.email,
      };
    } catch (e) {
      // Do nothing, leave req.user undefined
    }
  }
  next();
}
