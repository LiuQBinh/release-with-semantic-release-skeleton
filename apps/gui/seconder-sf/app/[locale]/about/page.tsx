import { SecChangeLanguage } from '@/components/common/SecChangeLanguage'
import { DynamicContent } from '@/components/pages/DynamicContent'
import { Button } from '@sec/gui-seconder/components/shadcn/button'
import { routing } from '@sec/gui-seconder/i18n/routing'
import { hasLocale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense, use } from 'react'

export const experimental_ppr = true

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}))
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  const t = await getTranslations('HomePage')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function About({params}: {params: Promise<{locale: string}>}) {
  const {locale} = use(params)

  // Enable static rendering
  setRequestLocale(locale)

  const t = useTranslations('HomePage')
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold">{t('about-title')}</h1>
        <h6>{t('about-description')}</h6>
        <Button><Link href="/">{t('home')}</Link></Button>
        <Suspense fallback={<div className="w-[600px] h-[300px]">Loading...</div>}>
          <DynamicContent />
        </Suspense>

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
        <SecChangeLanguage />
      </footer>
    </div>
  )
}
