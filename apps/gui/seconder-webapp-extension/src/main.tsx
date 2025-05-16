import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './i18n'
import './index.css'
import App from './App.tsx'
import { IntlProvider } from 'use-intl'
import enTranslations from '@sec/gui-i18n-localization/webapp-extension/languages/en.json'
import injectEvents from './extension/constants/injectEvents.ts'
import { MemoryRouter } from 'react-router'

injectEvents()

createRoot(document.getElementById('seconder-extension-root')!).render(
  <StrictMode>
    <IntlProvider locale="en" messages={enTranslations}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </IntlProvider>
  </StrictMode>,
)
