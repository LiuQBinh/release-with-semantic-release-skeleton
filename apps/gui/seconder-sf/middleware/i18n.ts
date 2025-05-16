import { routing } from '@sec/gui-seconder/i18n/routing'
import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

export function checkReferrerHasLocalePrefix(request: NextRequest) {
  const previousReferer = request.headers.get('referer')
  // validate referer is from same origin
  const isSameOrigin = previousReferer?.startsWith(request.nextUrl.origin)
  if (!isSameOrigin) return false

  const previousLocale = previousReferer ? new URL(previousReferer).pathname.split('/')[1] : null
  return routing.locales.some(locale => previousLocale === locale)
}


export default function i18nMiddleware(request: NextRequest) {
  // Check if request is has locale prefix or not (check in routing.locales)
  const hasLocalePrefix = routing.locales.some(locale => request.nextUrl.pathname.startsWith(`/${locale}`))
  const isPreviousHasLocalePrefix = checkReferrerHasLocalePrefix(request)

  console.log('===================request start=====================')
  console.log('request.nextUrl.href', request.nextUrl.href)
  // console.log('request.headers', request);
  console.log('===================request end=====================')

  let middlewareConf = routing



  if (!hasLocalePrefix && !isPreviousHasLocalePrefix) {
    middlewareConf = {
      ...routing,
      localePrefix: 'never',
    }
  }

  const handleI18nRouting = createMiddleware(middlewareConf)
  return handleI18nRouting(request)
}
