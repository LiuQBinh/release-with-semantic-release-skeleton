'use client'
import { ReactNode } from 'react'
import {
  ErrorBoundary,
  ErrorComponent,
} from 'next/dist/client/components/error-boundary'
import { useTranslations } from 'use-intl'
import { nsTranGlobalError } from '@sec/gui-i18n-localization/webapp-extension/namespace'

export const Error500: ErrorComponent = function Error500({ reset }) {
  const t = useTranslations(nsTranGlobalError)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
        <p className="text-gray-600 mb-6">{t('description')}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('try-again')}
        </button>
      </div>
    </div>
  )
}

export default function GlobalError({ children }: { children: ReactNode }) {
  return <ErrorBoundary errorComponent={Error500}>{children}</ErrorBoundary>
}
