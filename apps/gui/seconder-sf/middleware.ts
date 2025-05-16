import {NextRequest} from 'next/server'
import i18nMiddleware from './middleware/i18n'

export default async function middleware(request: NextRequest) {
  return i18nMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [{
    source: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  }]
}
