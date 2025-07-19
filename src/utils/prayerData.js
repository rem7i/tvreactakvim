// Prayer times utility functions

import { getParisTime } from './timezone.js'

export const getTodaysPrayerTimes = (prayerData) => {
  // Use Paris date instead of local date
  const today = getParisTime().toISODate() // This gives YYYY-MM-DD format
  const todayData = prayerData[today]

  if (todayData) {
    return {
      imsaku: todayData.imsaku,
      sabahu: todayData.sabahu,
      sunrise: todayData.sunrise,
      dreka: todayData.dreka,
      ikindia: todayData.ikindia,
      akshami: todayData.akshami,
      jacia: todayData.jacia
    }
  }

  // Fallback times if date not found
  return {
    imsaku: '02:47',
    sabahu: '03:15',
    sunrise: '04:59',
    dreka: '12:44',
    ikindia: '16:47',
    akshami: '20:22',
    jacia: '22:24'
  }
}

// Function to load CSV file
export const loadPrayerTimesFromCSV = async () => {
  try {
    const response = await fetch('/prayer_times.csv')
    const csvText = await response.text()
    return parsePrayerTimesCSV(csvText)
  } catch (error) {
    console.error('Error loading prayer times CSV:', error)
    return {}
  }
}

// Function to parse quotes CSV
export const parseQuotesCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const quotes = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line || line.trim() === '') continue

    // Handle CSV parsing with quoted text containing commas
    const match = line.match(/^"([^"]+)",(.+)$/)
    if (match) {
      quotes.push({
        text: match[1],
        source: match[2]
      })
    }
  }

  return quotes
}

// Function to load quotes from CSV
export const loadQuotesFromCSV = async () => {
  try {
    const response = await fetch('/quotes.csv')
    const csvText = await response.text()
    return parseQuotesCSV(csvText)
  } catch (error) {
    console.error('Error loading quotes CSV:', error)
    // Return fallback quotes if CSV fails to load
    return albanianQuotes
  }
}

// Keep the original quotes as fallback
export const albanianQuotes = [
  {
    text: "Kushdo që duron dhe fal, ta dijë se, në të vërtetë, këto janë nga veprimet më të virtytshme.",
    source: "Shura - Ajeti 43"
  },
  {
    text: "Më ka bërë të mirësjellshëm ndaj nënës sime, e nuk më ka bërë kryelartë dhe as të palumtur.",
    source: "Merjem: 32"
  },
  {
    text: "E kush beson në Allah dhe bën vepra të mira, Ai do t'i fusë në kopshte nëpër të cilat rrjedhin lumenj, ku do të qëndrojnë përgjithmonë.",
    source: "Nisa: 57"
  },
  {
    text: "Dhe kush i frikësohet Allahut, Ai do t'i bëjë një rrugëdalje dhe do ta furnizojë nga aty ku nuk e pret.",
    source: "Talak: 2-3"
  },
  {
    text: "O ju që besoni! Kërkoni ndihmë me durim dhe me namaz. Vërtet, Allahu është me të durueshmit.",
    source: "Bekare: 153"
  },
  {
    text: "Dhe kush shpëton një jetë, është sikur të ketë shpëtuar gjithë njerëzimin.",
    source: "Maide: 32"
  },
  {
    text: "Allahu nuk e ngarkon asnjë shpirt përtej mundësive të tij.",
    source: "Bekare: 286"
  },
  {
    text: "Dhe kush mbështetet tek Allahu, atij Ai i mjafton. Vërtet, Allahu e realizon çështjen e Tij.",
    source: "Talak: 3"
  },
  {
    text: "Dhe jepni lajmin e mirë të durueshmëve, të cilët kur i godet ndonjë fatkeqësi, thonë: 'Ne jemi të Allahut dhe tek Ai do të kthehemi'.",
    source: "Bekare: 155-156"
  },
  {
    text: "Dhe mos humbni shpresën nga mëshira e Allahut. Vërtet, nga mëshira e Allahut nuk humbin shpresën, përveç popullit jobesimtar.",
    source: "Jusuf: 87"
  }
]

// Albanian day and month names
export const albanianDays = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë']
export const albanianMonths = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor']

export const formatAlbanianDate = (date) => {
  const dayName = albanianDays[date.getDay()]
  const day = date.getDate()
  const month = albanianMonths[date.getMonth()]
  const year = date.getFullYear()
  
  return `${dayName}, ${day} ${month} ${year}`
}

// Prayer names in Albanian
export const prayerNames = {
  imsaku: 'Imsaku',
  sunrise: 'L. e Diellit',
  dreka: 'Dreka',
  ikindia: 'Ikindia',
  akshami: 'Akshami',
  jacia: 'Jacia'
}

