import {getWebsiteConstant} from '../language/SecConfigLanguage'
// IMPORTANT: Read README in case of changing component that depend on WEBSITE_LANGUAGE

const defaultLocale = 'en-GB'
export const locale = defaultLocale

const wrapperFormatNumber = function (val: string | number, floatNum: number, locale: string): string {
  if (!val) return '0'
  const n = Number.parseFloat(String(val))
  if (!n) {
    return String(val)
  }
  try {
    return n.toLocaleString(locale, {
      minimumFractionDigits: floatNum,
    })
  } catch(e: unknown) {
    console.error(e)
    // Case incorrect locale given (Ex: ja_JP instead of ja-JP)
    return n.toLocaleString(defaultLocale, {
      minimumFractionDigits: floatNum,
    })
  }
}

const floatNumDefault = 0
export const formatNumber = function (val: string | number, locale: string = defaultLocale, floatNum: number = floatNumDefault): string {
  return wrapperFormatNumber(val, floatNum, locale)
}

export const formatPrice = function (price: string | number, lang: string, separator: string = ''): string {
  const currencyData = getWebsiteConstant(lang || '')
  if(!currencyData) return String(price)

  if(currencyData.leftPosition) return '' + currencyData.currencyUnit + separator + price

  return '' + price + separator + currencyData.currencyUnit
}
