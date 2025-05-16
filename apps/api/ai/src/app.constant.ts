export const RATE_LIMIT_DEFAULT = {
  LIMIT: process.env.ENV == 'production' ? 100 : 500,
  TTL: 15 * 60, // 15 minutes
}
