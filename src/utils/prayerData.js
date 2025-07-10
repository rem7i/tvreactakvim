// Prayer times utility functions

export const parsePrayerTimesCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  const data = {}
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const date = values[0]
    data[date] = {
      imsaku: values[1],
      sunrise: values[2],
      dreka: values[3],
      ikindia: values[4],
      akshami: values[5],
      jacia: values[6]
    }
  }
  
  return data
}

export const getTodaysPrayerTimes = (prayerData) => {
  const today = new Date().toISOString().split('T')[0]
  return prayerData[today] || {
    imsaku: '02:47',
    sunrise: '04:59',
    dreka: '12:44',
    ikindia: '16:47',
    akshami: '20:22',
    jacia: '22:24'
  }
}

// Albanian quotes and verses
export const albanianQuotes = [
  {
    text: "Kushdo që duron dhe fal, ta dijë se, në të vërtetë, këto janë nga veprimet më të virtytshme.",
    source: "Shura - Ajeti 43"
  },
  {
    text: "Nuk ka ndodhur që të ketë ndonjë të pandëgjueshëm ndaj prindërve të tij, vetëmse e kemi gjetur të ishte arrogant, i palumtur. Pastaj e lexoi fjalën e Allahut të Lartësuar: \"Më ka bërë të mirësjellshëm ndaj nënës sime, e nuk më ka bërë kryelartë dhe as të pa lumtur (shekija)\"",
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
  
  return `${day}, ${month} ${year} / ${dayName}`
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

