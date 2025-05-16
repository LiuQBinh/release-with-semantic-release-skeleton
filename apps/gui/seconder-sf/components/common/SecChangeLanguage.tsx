'use client'
import { routing } from '@sec/gui-seconder/i18n/routing'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SecChangeLanguage() {
  const allLocales = routing.locales
  const currentPathname = usePathname()
  const currentLocale = useLocale()
  const currentPathnameWithoutLocale = currentPathname.replace(`/${currentLocale}`, '')


  return (
    <div>
      <div className="flex items-center gap-2">
        {allLocales.map((locale) => (
          <Link
            prefetch={false}
            key={locale}
            href={`/${locale}${currentPathnameWithoutLocale}`}
            className={`
              px-2 py-1 rounded-md text-sm font-medium
              ${locale === currentLocale
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted'
          }
            `}
          >
            {locale.toUpperCase()}
          </Link>
        ))}
      </div>



    </div>
  )
}

