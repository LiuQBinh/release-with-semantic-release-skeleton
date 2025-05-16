import { nsTranHome } from '@sec/gui-i18n-localization/webapp-extension/namespace'
import { Link } from 'react-router'
import { useTranslations } from 'use-intl'

export default function Home() {
  const t = useTranslations(nsTranHome)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">
        Seconder Extension - HOME PAGE - {t('title')}
      </h1>
      <Link to="/about">About</Link>
    </div>
  )
}
