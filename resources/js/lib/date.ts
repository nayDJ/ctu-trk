const LOCALE = 'id-ID'
const TIME_ZONE = 'Asia/Makassar'

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(value))
}

export function formatDateShort(value: string | Date): string {
  return formatDate(value, { month: 'short' })
}

export function formatMonthYear(value: string | Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string | Date): string {
  return `${formatDate(value, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })} WITA`
}
