import { format, utcToZonedTime } from 'date-fns-tz'

export type TWebsiteLanguage = string
export type TWebsiteLanguageOptional = TWebsiteLanguage | 'default'

export const DATE_FORMATS = [
  'dateFormat',
  'dateFormatSlash',
  'dateFormatSlashMiniYear',
  'dayAndMonthFormatSlash',
  'monthAndYearFormatSlash',
  'fullDateFormatAmPm',
  'timeAndDateFormat',
  'time24hAndDateFormat',
  'monthAndYearFormatLong',
] as const
export type TDateFormat = (typeof DATE_FORMATS)[number]

export const dateFormats: Record<
  TDateFormat,
  Record<TWebsiteLanguage, string>
> = {
  dateFormat: {
    ja: 'yyyy年MM月dd日',
    en: 'MM/dd/yyyy',
    th: 'dd/MM/yyyy',
    vi: 'dd/MM/yyyy',
    zh: 'yyyy年MM月dd日',
  },
  dateFormatSlash: {
    ja: 'yyyy/MM/dd',
    en: 'MM/dd/yyyy',
    th: 'dd/MM/yyyy',
    vi: 'dd/MM/yyyy',
    zh: 'yyyy/MM/dd',
  },
  dateFormatSlashMiniYear: {
    ja: 'yy/MM/dd',
    en: 'MM/dd/yy',
    th: 'dd/MM/yy',
    vi: 'dd/MM/yy',
    zh: 'yy/MM/dd',
  },
  dayAndMonthFormatSlash: {
    ja: 'MM/dd',
    en: 'MM/dd',
    th: 'dd/MM',
    vi: 'dd/MM',
    zh: 'MM/dd',
  },
  monthAndYearFormatSlash: {
    ja: 'yyyy/MM',
    en: 'MM/yyyy',
    th: 'MM/yyyy',
    vi: 'MM/yyyy',
    zh: 'yyyy/MM',
  },
  monthAndYearFormatLong: {
    ja: 'yyyy年MM月',
    en: 'MMMM yyyy',
    th: 'MM/yyyy',
    vi: 'MM/yyyy',
    zh: 'yyyy年MM月',
  },
  fullDateFormatAmPm: {
    ja: 'p yyyy/MM/dd',
    en: 'p MM/dd/yyyy',
    th: 'p dd/MM/yyyy',
    vi: 'p dd/MM/yyyy',
    zh: 'p yyyy/MM/dd',
  },
  timeAndDateFormat: {
    ja: 'yyyy/MM/dd h:mm aa',
    en: 'MM/dd/yyyy h:mm aa',
    th: 'dd/MM/yyyy h:mm aa ',
    vi: 'dd/MM/yyyy h:mm aa',
    zh: 'yyyy/MM/dd h:mm aa',
  },
  time24hAndDateFormat: {
    ja: 'yyyy/MM/dd HH:mm',
    en: 'MM/dd/yyyy HH:mm',
    th: 'dd/MM/yyyy HH:mm',
    vi: 'HH:mm dd/MM/yyyy',
    zh: 'yyyy/MM/dd HH:mm',
  },
}

export const timeZone: { [index: string]: string } = {
  ja: 'Asia/Tokyo',
  en: 'America/New_York',
  th: 'Asia/Bangkok',
  zh: 'Asia/Shanghai',
  // tw: 'Asia/Taipei',
  vi: 'Asia/Ho_Chi_Minh',
}

// tricky to use useI18nContext
const UseI18nFn = (rawDate: Date | number, type: string) => {
  const locale = process.env
    .NEXT_PUBLIC_WEBSITE_LANGUAGE as unknown as keyof typeof timeZone
  const zonedDate = utcToZonedTime(rawDate, timeZone[locale])
  return format(zonedDate, type, { timeZone: timeZone[locale] })
}

/**
 * Format rawDate to locale date string
 * Ex:
 * ```
 * dateFormat(rawdate, 'yyyy/MM/dd')
 * ```
 * @param rawdate Date object to format to local date
 * @param rawFormat Raw format
 * @returns Formatted date string
 */
export function formatDate(
  rawdate: Date | number,
  rawFormat: string,
): string {
  return UseI18nFn(rawdate, rawFormat)
}

/**
 * Format rawDate to locale date string
 * Ex:
 * ```
 * formatDateByFormatType(rawdate, 'dateFormatSlash')
 * ```
 * @param rawdate Date object to format to local date
 * @param dateFormatType The format type. See usage
 * @returns Formatted date string
 */
export function formatDateByFormatType(
  rawdate: Date | number,
  dateFormatType: TDateFormat,
): string {
  const locale = process.env.NEXT_PUBLIC_WEBSITE_LANGUAGE as unknown as TWebsiteLanguage
  // Get base on locale, if does not exists
  const rawFormat = dateFormats[dateFormatType][locale]

  return UseI18nFn(rawdate, rawFormat)
}
