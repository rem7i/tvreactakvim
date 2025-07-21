export const config = {
  intervals: {
    wallpaperRotation: import.meta.env.VITE_WALLPAPER_ROTATION_INTERVAL || 43200000,
    quoteRotation: import.meta.env.VITE_QUOTE_ROTATION_INTERVAL || 55000,
    clockUpdate: import.meta.env.VITE_CLOCK_UPDATE_INTERVAL || 1000
  },
  features: {
    debugLogging: import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true'
  },
  endpoints: {
    prayerTimes: import.meta.env.VITE_PRAYER_TIMES_CSV_URL || '/prayer_times.csv',
    quotes: import.meta.env.VITE_QUOTES_CSV_URL || '/quotes.csv'
  }
}
