import { ReactNode } from 'react'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import pick from 'lodash/pick'
import { routing } from '@sec/gui-seconder/i18n/routing'
import AuthProvider from '@sec/gui-seconder/store/auth'
import { Geist, Geist_Mono } from 'next/font/google'
import GlobalError from '@sec/gui-seconder/components/error/GlobalError'
import SECToastProvider from '@sec/gui-seconder/components/common/SECToastProvider'
import * as React from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const RootLayout = async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  if (!hasLocale(routing.locales, locale)) notFound()

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider
          messages={pick(messages, 'AboutPage', 'HomePage', 'GlobalError')}
        >
          <GlobalError>
            <SECToastProvider>
              <AuthProvider authPl={'{"userId": 123456}'}>{children}</AuthProvider>
            </SECToastProvider>
          </GlobalError>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
