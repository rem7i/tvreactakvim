import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Settings, Sun, Moon, Sunset, Sunrise } from 'lucide-react'
import mosqueBg from './assets/mosque-bg.jpg'
import { getParisTime, getParisDate } from './utils/timezone.js'

// Dynamically import all wallpapers in wallpapers folder
const wallpapers = import.meta.glob('./assets/wallpapers/*.jpg', { eager: true, import: 'default' });

function getRandomWallpaper() {
  const wallpaperKeys = Object.keys(wallpapers);
  if (wallpaperKeys.length === 0) return mosqueBg;
  
  const randomKey = wallpaperKeys[Math.floor(Math.random() * wallpaperKeys.length)];
  return wallpapers[randomKey] || mosqueBg;
}

import { albanianQuotes, formatAlbanianDate, prayerNames, loadPrayerTimesFromCSV, getTodaysPrayerTimes, loadQuotesFromCSV } from './utils/prayerData.js'
import { formatIslamicDate } from './utils/hijri-converter.js'
import './App.css'

function App() {
  // Always skip the form on first launch
  const [showForm, setShowForm] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => getParisDate())
  const [showCountdown, setShowCountdown] = useState(false)
  const [prayerTimesData, setPrayerTimesData] = useState({})
  const [currentWallpaper, setCurrentWallpaper] = useState(() => getRandomWallpaper())
  const [formData, setFormData] = useState(() => {
    // Try to load saved data from localStorage
    const saved = localStorage.getItem('mosqueFormData')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing saved form data:', e)
      }
    }
    return {
      imam: '',
      mosqueName: '',
      location: ''
    }
  })

  // Get today's prayer times from CSV data
  const prayerTimes = getTodaysPrayerTimes(prayerTimesData)

  // Debug: Log prayer times only when the data changes
  useEffect(() => {
    if (Object.keys(prayerTimesData).length > 0) {
      const today = getParisTime().toISODate()
      console.log('Today (Paris):', today)
      console.log('Prayer times for today:', prayerTimes)
    }
  }, [prayerTimesData]) // Only re-run when prayer times data changes

  const [currentQuote, setCurrentQuote] = useState(albanianQuotes[0])
  const [quotesData, setQuotesData] = useState(albanianQuotes)

  // Load prayer times from CSV on component mount
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        const data = await loadPrayerTimesFromCSV()
        setPrayerTimesData(data)
        console.log('Prayer times loaded from CSV:', Object.keys(data).length, 'days')
      } catch (error) {
        console.error('Failed to load prayer times:', error)
      }
    }

    loadPrayerTimes()
  }, [])

  // Load quotes from CSV on component mount
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const quotes = await loadQuotesFromCSV()
        setQuotesData(quotes)
        setCurrentQuote(quotes[0] || albanianQuotes[0])
        console.log('Quotes loaded from CSV:', quotes.length, 'quotes')
      } catch (error) {
        console.error('Failed to load quotes:', error)
        setQuotesData(albanianQuotes)
      }
    }

    loadQuotes()
  }, [])

  // Update current time every second using Paris timezone
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getParisDate())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Change wallpaper every 12 hours
  useEffect(() => {
    const wallpaperTimer = setInterval(() => {
      setCurrentWallpaper(getRandomWallpaper())
    }, 43200000) // 12 hours

    return () => clearInterval(wallpaperTimer)
  }, [])

  // Rotate quotes and countdown every 55 seconds
  useEffect(() => {
    const contentTimer = setInterval(() => {
      setShowCountdown(prev => {
        if (!prev) {
          return true
        } else {
          setCurrentQuote(quotesData[Math.floor(Math.random() * quotesData.length)])
          return false
        }
      })
    }, 55000)

    return () => clearInterval(contentTimer)
  }, [quotesData])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // Save form data to localStorage
    localStorage.setItem('mosqueFormData', JSON.stringify(formData))
    setShowForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      // Auto-save to localStorage as user types
      localStorage.setItem('mosqueFormData', JSON.stringify(newData))
      return newData
    })
  }

  const getCurrentPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes()
    const times = [
      { name: 'imsaku', time: prayerTimes.imsaku },
      { name: 'sunrise', time: prayerTimes.sunrise },
      { name: 'dreka', time: prayerTimes.dreka },
      { name: 'ikindia', time: prayerTimes.ikindia },
      { name: 'akshami', time: prayerTimes.akshami },
      { name: 'jacia', time: prayerTimes.jacia }
    ]

    for (let i = 0; i < times.length; i++) {
      const [hours, minutes] = times[i].time.split(':').map(Number)
      const prayerMinutes = hours * 60 + minutes
      
      if (now < prayerMinutes) {
        return times[i].name
      }
    }
    
    return 'imsaku' // Next day's first prayer
  }

  const getNextPrayerCountdown = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes()
    const times = [
      { name: 'imsaku', time: prayerTimes.imsaku, label: prayerNames.imsaku },
      { name: 'sunrise', time: prayerTimes.sunrise, label: prayerNames.sunrise },
      { name: 'dreka', time: prayerTimes.dreka, label: prayerNames.dreka },
      { name: 'ikindia', time: prayerTimes.ikindia, label: prayerNames.ikindia },
      { name: 'akshami', time: prayerTimes.akshami, label: prayerNames.akshami },
      { name: 'jacia', time: prayerTimes.jacia, label: prayerNames.jacia }
    ]

    for (let i = 0; i < times.length; i++) {
      const [hours, minutes] = times[i].time.split(':').map(Number)
      const prayerMinutes = hours * 60 + minutes
      
      if (now < prayerMinutes) {
        const remainingMinutes = prayerMinutes - now
        const hours = Math.floor(remainingMinutes / 60)
        const mins = remainingMinutes % 60
        
        return {
          prayer: times[i].label,
          time: hours > 0 ? `${hours} orë e ${mins} minuta` : `${mins} minuta`
        }
      }
    }
    
    // Next day's first prayer
    const [hours, minutes] = times[0].time.split(':').map(Number)
    const prayerMinutes = hours * 60 + minutes
    const remainingMinutes = (24 * 60) - now + prayerMinutes
    const hrs = Math.floor(remainingMinutes / 60)
    const mins = remainingMinutes % 60
    
    return {
      prayer: times[0].label,
      time: hrs > 0 ? `${hrs} orë e ${mins} minuta` : `${mins} minuta`
    }
  }

  const getPrayerIcon = (prayer) => {
    switch (prayer) {
      case 'imsaku':
      case 'jacia':
        return <Moon className="w-6 h-6" />
      case 'akshami':
        return <Sunset className="w-6 h-6" />
      case 'sunrise':
        return <Sunrise className="w-6 h-6" />
      default:
        return <Sun className="w-6 h-6" />
    }
  }

  // Returns the key of the actual (ongoing) prayer
  const getActualPrayer = () => {
    const prayers = ['imsaku', 'sunrise', 'dreka', 'ikindia', 'akshami', 'jacia'];
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    let lastPrayer = prayers[0];
    for (let i = 0; i < prayers.length; i++) {
      const t = prayerTimes[prayers[i]];
      if (!t) continue;
      const [h, m] = t.split(':').map(Number);
      const mins = h * 60 + m;
      if (now >= mins) {
        lastPrayer = prayers[i];
      } else {
        break;
      }
    }
    return lastPrayer;
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
           style={{backgroundImage: `url(${mosqueBg})`}}>
        <div className="absolute inset-0 bg-black/40"></div>
        <Card className="w-full max-w-md relative z-10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
              📝 Plotësoni të dhënat e xhamisë
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imam" className="text-green-600 font-semibold flex items-center gap-2">
                  🧔🏻 Imami:
                </Label>
                <Input
                  id="imam"
                  value={formData.imam}
                  onChange={(e) => handleInputChange('imam', e.target.value)}
                  className="border-green-500 focus:border-green-600 transition-colors"
                  placeholder="Emri i imamit..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mosqueName" className="text-orange-600 font-semibold flex items-center gap-2">
                  🕌 Emri i xhamisë:
                </Label>
                <Input
                  id="mosqueName"
                  value={formData.mosqueName}
                  onChange={(e) => handleInputChange('mosqueName', e.target.value)}
                  className="border-orange-500 focus:border-orange-600 transition-colors"
                  placeholder="Emri i xhamisë..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-teal-600 font-semibold flex items-center gap-2">
                  📍 Lokacioni:
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="border-teal-500 focus:border-teal-600 transition-colors"
                  placeholder="Fshati, Qyteti..."
                />
              </div>
              <div className="text-sm text-gray-500">
                Copyright © <a href="https://takvimi.app" className="text-blue-500 hover:text-blue-600">Takvimi.app</a> - All rights reserved
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 transition-colors">
                ✅ Ruaje
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const nextPrayer = getNextPrayerCountdown()
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-white relative overflow-hidden"
         style={{backgroundImage: `url(${currentWallpaper})`}}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header - Dates */}
        <div className="flex justify-between items-start px-6 pt-4 pb-2">
          <div className="bg-black/10 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-semibold">
              {formatAlbanianDate(currentTime)}
            </div>
          </div>
          <div className="bg-black/10 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-semibold">
              {formatIslamicDate(currentTime)}
            </div>
          </div>
        </div>
        {/* Center Content - Clock and Rotating Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-2">
          <div className="text-center mb-4">
            <div className="text-8xl font-bold mb-1 text-shadow-xl tracking-wider">
              {currentTime.toLocaleTimeString('en-GB')}
            </div>
          </div>
          <div className="max-w-4xl w-full">
            {showCountdown ? (
              <div className="text-center w-full p-4 rounded-2xl backdrop-transparent border border-yellow-500/30 shadow-2xl prayer-glow tv-transition">
                <div className="text-xl font-medium mb-2 text-yellow-100 text-shadow-lg">⏳ Vakti i ardhshëm</div>
                <p className="text-3xl font-bold mb-1 text-white text-shadow-xl">
                  {nextPrayer.prayer}
                </p>
                <p className="text-2xl font-semibold text-yellow-100 text-shadow-lg">
                  edhe {nextPrayer.time}
                </p>
              </div>
            ) : (
              <div className="bg-black/40 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl tv-transition">
                <div className="text-center">
                  <p className="text-xl leading-relaxed mb-3 text-white text-shadow-lg">
                    {currentQuote.text}
                  </p>
                  <p className="text-lg opacity-80 text-blue-200 text-shadow-lg">
                    (Kuran, {currentQuote.source})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Info Row - Mosque and Imam (just above Prayer Times grid) */}
        {(formData.mosqueName || formData.location || formData.imam) && (
          <div className="flex justify-between items-center w-full px-8 pb-2">
            <div className="text-green-300 font-semibold text-xl">
              {formData.mosqueName && <>🕌 {formData.mosqueName}</>}
              {formData.location && <span className="ml-2 text-white font-normal">{formData.location}</span>}
            </div>
            <div className="text-blue-300 font-semibold text-xl">
              {formData.imam && <>🎓 {formData.imam}</>}
            </div>
          </div>
        )}
        {/* Bottom - Prayer Times */}
        <div className="w-full flex justify-center pb-6">
          <div className="bg-black/30 p-3 rounded-2xl backdrop-blur-enhanced border border-white/20 w-full">
            <div className="flex flex-col items-center w-full">
              
              <div className="grid grid-cols-6 gap-6 w-full">
                {['imsaku', 'sunrise', 'dreka', 'ikindia', 'akshami', 'jacia'].map((prayer) => {
                  const time = prayerTimes[prayer];
                  const nextPrayerKey = getCurrentPrayer();
                  const actualPrayerKey = getActualPrayer();
                  const isNextPrayer = nextPrayerKey === prayer;
                  const isActualPrayer = actualPrayerKey === prayer;
                  let cardClass = 'text-center p-6 rounded-xl tv-transition ';
                  if (isNextPrayer) {
                    cardClass += 'bg-transparent shadow-2xl border-2 border-yellow-300 gentle-pulse prayer-glow ';
                  } else if (isActualPrayer) {
                    cardClass += 'bg-black/60 border-2 border-green-400 shadow-xl ';
                  } else {
                    cardClass += 'bg-black/50 hover:bg-black/60 border border-white/20 ';
                  }
                  // Special rendering for Imsaku: show both Imsaku and Sabahu
                  if (prayer === 'imsaku') {
                    return (
                      <div key={prayer} className={cardClass}>
                        <div className={`flex justify-center mb-3`}>
                          <div className={`p-2 rounded-full ${isNextPrayer || isActualPrayer ? 'bg-white/20' : 'bg-white/10'}`}>
                            {getPrayerIcon(prayer)}
                          </div>
                        </div>
                        <div className={`text-lg font-bold mb-2 text-shadow-lg ${isNextPrayer || isActualPrayer ? 'text-white' : 'text-green-300'}`}>
                          {prayerNames[prayer]}
                        </div>
                        <div className={`text-5xl font-bold text-shadow-lg ${isNextPrayer || isActualPrayer ? 'text-white' : 'text-white'}`}>
                          {time}
                          <div className="text-base font-semibold text-blue-200 mt-2">
                            Sabahu: {prayerTimes.sabahu}
                          </div>
                        </div>
                        {isNextPrayer && (
                          <div className="text-sm font-medium mt-2 text-yellow-100 animate-pulse text-shadow-lg">
                            ● I ARDHSHËM ●
                          </div>
                        )}
                        {isActualPrayer && (
                          <div className="text-sm font-medium mt-2 text-green-200 animate-pulse text-shadow-lg">
                            ● AKTUAL ●
                          </div>
                        )}
                      </div>
                    );
                  }
                  // Default rendering for other prayers
                  return (
                    <div key={prayer} className={cardClass}>
                      <div className="flex justify-center mb-3">
                        <div className={`p-2 rounded-full ${isNextPrayer || isActualPrayer ? 'bg-white/20' : 'bg-white/10'}`}>{getPrayerIcon(prayer)}</div>
                      </div>
                      <div className={`text-lg font-bold mb-2 text-shadow-lg ${isNextPrayer || isActualPrayer ? 'text-white' : 'text-green-300'}`}>{prayerNames[prayer]}</div>
                      <div className={`text-5xl font-bold text-shadow-lg ${isNextPrayer || isActualPrayer ? 'text-white' : 'text-white'}`}>{time}</div>
                      {isNextPrayer && (
                        <div className="text-sm font-medium mt-2 text-yellow-100 animate-pulse text-shadow-lg">● I ARDHSHËM ●</div>
                      )}
                      {isActualPrayer && (
                        <div className="text-sm font-medium mt-2 text-green-200 animate-pulse text-shadow-lg">● AKTUAL ●</div>
                      )}
                    </div>
                  );
                })}
              </div>
              
            </div>
          </div>
        </div>
      </div>
      {/* Settings button stays fixed at bottom right */}
      <button
        onClick={() => {
          setShowForm(true)
        }}
        className="fixed bottom-6 right-6 z-50 p-3 bg-green-600 rounded-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer border-2 border-green-500 hover:border-blue-400"
        style={{ pointerEvents: 'auto' }}
        title="Cilësimet - Kliko për të ndryshuar të dhënat"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  )
}

export default App

