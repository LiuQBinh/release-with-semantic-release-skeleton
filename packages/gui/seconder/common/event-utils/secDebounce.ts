export const DEFAULT_DEBOUNCE = 400

/**
 * Debounce function, call once after timeout
 * will reset & re-wait timeout in case re-call before timeout
 * @param fn callback function
 * @param wait in milliseconds
 * @returns {(...args: any) => void}
 */
export function secDebounce(fn: any, wait?: number) {
  let timerId: any, lastArguments: any, lastThis: any
  return (...args: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    timerId && clearTimeout(timerId)
    lastArguments = args
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    timerId = setTimeout(function () {
      fn.apply(lastThis, lastArguments)
      timerId = null
    }, wait || 400)
  }
}

export function createDebouncedFn(wait: number = DEFAULT_DEBOUNCE) {
  return secDebounce((fn: () => void) => fn(), wait)
}
