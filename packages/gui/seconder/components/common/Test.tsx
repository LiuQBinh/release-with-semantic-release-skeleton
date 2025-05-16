'use client'

import { useTranslations } from 'use-intl'
import { nsTranHome } from '@sec/gui-i18n-localization/webapp-extension/namespace'

export function Test() {
  const t = useTranslations(nsTranHome)

  return (
    <div>
      <div>{t('title')}</div>
    </div>
  )
}