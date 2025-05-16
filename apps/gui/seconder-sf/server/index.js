/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cookieParser = require('cookie-parser')
const { createAuthTokenMiddleware } = require('@seconder/share/auth/middleware/token-middleware')
const { FileCacheService } = require('@seconder/share/services/cache/file-cache.service')
const { AuthTokenCacheService } = require('@seconder/share/auth/services/cache/token-cache.service')
const { AUTH_HEADER_NAME } = require('@seconder/share/auth/constants')

const port = process.env.PORT || 3000
const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8386'
const app = next({ dev: true, dir: __dirname + '/../' })
const handle = app.getRequestHandler()

// Create the cache and token services
const cacheService = new FileCacheService()
const tokenCacheService = new AuthTokenCacheService(cacheService)

app.prepare().then(() => {
  const server = express()

  // Add cookie parser middleware
  server.use(cookieParser())

  // Create token middleware
  const tokenMiddleware = createAuthTokenMiddleware(tokenCacheService, {
    skipPaths: [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/health',
      '/favicon.ico',
      '/_next/*',
      '/static/*'
    ],
    errorHandler: (error, req, res, next) => {
      next()
    }
  })

  // Apply token middleware globally (covers both /api and document/page requests)
  server.use(tokenMiddleware)

  const apiProxy = createProxyMiddleware({
    target: AI_API_URL,
    changeOrigin: true,
    pathRewrite: {
      '/ai': '/api/ai',
    },
    onProxyReq: (proxyReq, req) => {
      // Forward user headers from token middleware
      if (req.headers[AUTH_HEADER_NAME]) {
        proxyReq.setHeader(AUTH_HEADER_NAME, req.headers[AUTH_HEADER_NAME])
      }
    }
  })

  server.use('/api', (req, res, next) => {
    console.log(`Proxying request: ${req.method} ${req.url} ${req.path}`)
    return next()
  }, apiProxy)

  server.use('/', (req, res) => handle(req, res))

  server.listen(port, () => {
    console.log(`✅ Custom server running at http://localhost:${port}`)
  })
})
