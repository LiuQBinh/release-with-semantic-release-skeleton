import type {AxiosInstance} from 'axios'

const RETRIES = 3

export default function retryTimeoutWrapper(axios: AxiosInstance) {
  // init config.retryCount per request
  axios.interceptors.request.use((config) => {
    // @ts-ignore
    config.retryCount = config.retryCount || 0
    return config
  })

  axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error.config
      const shouldRetry =
        error.code !== 'ECONNABORTED' &&
        error.response &&
        [429, 502].includes(error.response.status) &&
        config.retryCount < RETRIES &&
        !config.secIgnoreRetry

      if (shouldRetry) {
        // increase retry count
        config.retryCount += 1

        // variables
        let delay = error.response.headers['retry-after'] || 30
        const status = error.response.status

        // change delay time in case 502 error
        if (status == 502) delay = 0.2 * config.retryCount

        // retry
        console.log(`=========== Status ${status}. Retry after ${delay} seconds ...`)
        return new Promise(resolve =>
          setTimeout(() => resolve(axios(config)), delay * 1e3)
        )
      }

      else if(['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'].includes(error.code) && config.retryCount < RETRIES) {
        // increase retry count
        config.retryCount += 1

        // retry
        console.log('Call %s %s. Retry after 8 seconds ...', config.url, error.code)
        return new Promise(resolve =>
          setTimeout(() => resolve(axios(config)), 8e3)
        )
      }

      return Promise.reject(error)
    })
}

