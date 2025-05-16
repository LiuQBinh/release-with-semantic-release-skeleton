import axios, { AxiosRequestConfig } from 'axios'
import {SEC_REDIRECT_CODE, auPayload, userAgent, xForwardedFor} from './const'
import retryTimeoutWrapper from './retryTimeoutWrapper'
// import {setExtra, setTag} from '@sentry/nextjs'

const options: AxiosRequestConfig = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 'au-payload':'{"userId":182312}',
  },
  baseURL: (
    // if is in server or not
    typeof window === 'undefined' ? process.env.SERVER_HTTP_BASE_URL : process.env.NEXT_PUBLIC_CLIENT_HTTP_BASE_URL
  )
}

const http = axios.create(options)
if (typeof window !== 'undefined') {
  http.interceptors.response.use(function (response) {
    return response
  }, async function (error) {
    if (error?.response?.status === SEC_REDIRECT_CODE) {
      // Build redirect URL
      const loginUrl = new URL(process.env.NEXT_PUBLIC_ACCOUNT_HOST_URL + '/login')
      // Param to redirect back to original page
      loginUrl.searchParams.set('clientId', process.env.NEXT_PUBLIC_HTTP_CLIENT_ID || '')
      loginUrl.searchParams.set('u', window.location.href)

      window.location.assign(loginUrl)
      await new Promise(resolve => setTimeout(resolve, 5e3))
    }
    return Promise.resolve(error)
  })
}

// retry call api when error
retryTimeoutWrapper(http)

export default http
interface ISecHeader {
  headers: Headers
  extraHeaderKeys?: Array<string>
}

/**
 * Append headers to axios requests on server side.<br />
 * Basic usage:
 * ```
 * import { headers } from 'next/headers'
 * ...
 * const headerList = headers()
 * http.get('/api/...', {
 *   headers: appendSecHeader({ headers: headerList }),
 * })
 * ...
 * ```
 * @param props
 * @returns A record of headers & value
 */
export function appendSecHeader(props: ISecHeader): Record<string, string> {
  const { headers, extraHeaderKeys } = props

  let headerKeys = [auPayload, userAgent, xForwardedFor]
  if(extraHeaderKeys && extraHeaderKeys?.length > 0) {
    headerKeys = headerKeys.concat(extraHeaderKeys)
  }
  const reqHeader: Record<string, string> = {}
  headerKeys.forEach(item => {reqHeader[item] = headers.get(item) || ''})

  // // TODO: remove when added sentry for all languages
  // if(process.env.NEXT_PUBLIC_WEBSITE_LANGUAGE === 'ja') {
  //   setExtra('auPayload', {auPayload: JSON.stringify(reqHeader[auPayload])})
  //   setTag('TYPE', typeof window === 'undefined' ? 'server' : 'client')
  // }

  return reqHeader
}

export type TSecRes<T = unknown> = {
  data: T,
  message?: string,
  error?: string
}

/**
 * Append headers to fetch requests on server side.<br />
 * Basic usage:
 * ```
 * import { headers } from 'next/headers'
 * ...
 * const headerList = headers()
 * fetch('/api/...', {
 *   headers: appendSecFetchHeader({ headers: headerList }),
 *   next: { ... }
 * })
 * ...
 * ```
 * @param props
 * @returns A record of headers & value
 */
// export const appendSecFetchHeader: typeof appendSecHeader = (props) => {
//   return {
//     ...options.headers,
//     ...appendSecHeader(props)
//   }
// }
