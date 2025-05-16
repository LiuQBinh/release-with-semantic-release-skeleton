import { isChromeExtension } from './utils'

export default function injectEvents() {
  if (!isChromeExtension()) return

  chrome.runtime.onMessage.addListener((message) => {
    // Might not be as easy if there are multiple side panels open
    if (message === 'isSidePanelOpen') {
      return true
    }

    if (message === 'closeSidePanel') {
      window.close()
    }
  })

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      window.close()
    }
  })
}
