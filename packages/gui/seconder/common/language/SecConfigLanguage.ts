export const configLanguages = {
  ja: {
    currencyUnit: '￥',
    leftPosition: true,
    locale: 'ja-JP'
  },
  vi: {
    currencyUnit: '₫',
    leftPosition: false,
    locale: 'vi-VN'
  },
  en: {
    currencyUnit: '$',
    leftPosition: true,
    locale: 'en-GB'
  },
  th: {
    currencyUnit: '฿',
    leftPosition: true,
    locale: 'th-TH'
  },
  zh: {
    currencyUnit: '¥',
    leftPosition: true,
    locale: 'zh-CN'
  },
  es: {
    currencyUnit: '€',
    leftPosition: true,
    locale: 'es-ES'
  },
  ko: {
    currencyUnit: '₩',
    leftPosition: true,
    locale: 'ko-KR',
    spaceWidth: 5
  },
  id: {
    currencyUnit: 'Rp',
    leftPosition: true,
    locale: 'id-ID',
    spaceWidth: 5
  },
} as Record<string, any>

export function getWebsiteConstant(website_language: string) {
  return configLanguages[website_language]
}