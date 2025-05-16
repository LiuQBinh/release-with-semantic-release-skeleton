/**
 * The native method "Element.scrollIntoView" is not smooth in IOS
 * This function use to "scrollToElSmoothly", support for IOS
 * @param el element scroll to
 * @param duration in milliseconds
 * @param positionOffset control position of element after scroll
 * @param cb callback function
 * @param focusEl if value is true, focus on the element (only working for HTMLInputElement)
 * @returns {(...args: any) => void}
 */
type ScrollToElSmoothlyParameter = {
  el: HTMLElement;
  duration?: number;
  positionOffset?: number;
  cb?: () => void;
  focusEl?: boolean;
  containerId?: string | 'window';
  isScrollInMobile?: boolean;
}

export function scrollToElSmoothly({
  el,
  duration = 300,
  positionOffset,
  cb,
  focusEl = true,
  containerId = '#BodyWrapper',
  isScrollInMobile = false
}: ScrollToElSmoothlyParameter) {
  const isDesktop = window.innerWidth > 960 // TODO: Huynh get desktop width from theme
  const containerEle = isDesktop ? (containerId === 'window' ? window : document.querySelector(containerId)) : isScrollInMobile ? document.querySelector(containerId) : window


  if (!el || !containerEle) {
    console.error('el or containerEle is invalid!')
    return
  }

  const scrollY = ( Object.is(window, containerEle)) ?  window.scrollY : (containerEle as Element)?.scrollTop
  const elementPos = scrollY + el.getBoundingClientRect().top - (positionOffset ?? screen.height * 0.3)
  const currentPos = scrollY
  let startTime = 0

  window.requestAnimationFrame(function step(currentTime) {
    startTime = startTime || currentTime
    const progress = currentTime - startTime
    const scrollAmount = currentPos < elementPos
      ? ((elementPos - currentPos) * progress) / duration + currentPos
      : currentPos - ((currentPos - elementPos) * progress) / duration

    containerEle.scrollTo(0, scrollAmount)

    if (progress < duration) {
      window.requestAnimationFrame(step)
    } else {
      containerEle.scrollTo(0, elementPos)
      cb?.()
    }
  })

  if (focusEl && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
    el.focus()
  }
}
