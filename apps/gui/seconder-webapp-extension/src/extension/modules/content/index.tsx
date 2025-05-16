import { createRoot } from 'react-dom/client'
import App from './App'
import tailwindCssString from '../../../index.css?inline'

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    chrome.runtime.sendMessage('closeSidePanel')
  }
})

const root = document.createElement('div')
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root'

document.body.append(root)

const rootIntoShadow = document.createElement('div')
rootIntoShadow.id = 'shadow-root'

const shadowRoot = root.attachShadow({ mode: 'open' })

if (navigator.userAgent.includes('Firefox')) {
  /**
   * In the firefox environment, adoptedStyleSheets cannot be used due to the bug
   * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
   *
   * Injecting styles into the document, this may cause style conflicts with the host page
   */
  const styleElement = document.createElement('style')
  styleElement.innerHTML = tailwindCssString
  shadowRoot.appendChild(styleElement)
} else {
  /** Inject styles into shadow dom */
  const globalStyleSheet = new CSSStyleSheet()
  globalStyleSheet.replaceSync(tailwindCssString)
  shadowRoot.adoptedStyleSheets = [globalStyleSheet]
}

shadowRoot.appendChild(rootIntoShadow)
createRoot(rootIntoShadow).render(<App />)
