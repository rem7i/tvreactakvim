import { DateTime } from 'luxon'

// Always use Paris timezone regardless of user's local timezone
const PARIS_TIMEZONE = 'Europe/Paris'

export const getParisTime = () => {
  return DateTime.now().setZone(PARIS_TIMEZONE)
}

export const getParisDate = () => {
  return getParisTime().toJSDate()
}

export const getParisDateString = () => {
  return getParisTime().toISODate() // Returns YYYY-MM-DD format
}
