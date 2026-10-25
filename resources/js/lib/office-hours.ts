const TIME_ZONE = 'Asia/Makassar'
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const OPEN_MINUTES = 8 * 60
const CLOSE_MINUTES = 16 * 60

export function isOfficeOpen(date: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? ''

  const weekday = get('weekday')
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))

  return WEEKDAYS.includes(weekday)
    && minutes >= OPEN_MINUTES
    && minutes < CLOSE_MINUTES
}
