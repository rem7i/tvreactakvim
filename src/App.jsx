import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Settings, Sun, Moon, Sunrise } from 'lucide-react'
import mosqueBg from './assets/mosque-bg.jpg'
import { albanianQuotes, formatAlbanianDate, prayerNames, loadPrayerTimesFromCSV, getTodaysPrayerTimes } from './utils/prayerData.js'
import { formatIslamicDate } from './utils/hijri-converter.js'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(() => {
    // Show form initially only if no data is saved
    const saved = localStorage.getItem('mosqueFormData')
    return !saved
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCountdown, setShowCountdown] = useState(false)
  const [prayerTimesData, setPrayerTimesData] = useState({})
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
      location: '',
      showIqamah: false
    }
  })

  // Get today's prayer times from CSV data
  const prayerTimes = getTodaysPrayerTimes(prayerTimesData)

  // Debug: Log today's prayer times
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    console.log('Today:', today)
    console.log('Prayer times for today:', prayerTimes)
  }, [prayerTimes])

  const [currentQuote, setCurrentQuote] = useState(albanianQuotes[0])

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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Rotate quotes and countdown every 15 seconds
  useEffect(() => {
    const contentTimer = setInterval(() => {
      setShowCountdown(prev => {
        if (!prev) {
          // Show countdown for 15 seconds
          return true
        } else {
          // Show quote for 15 seconds and rotate to next quote
          setCurrentQuote(albanianQuotes[Math.floor(Math.random() * albanianQuotes.length)])
          return false
        }
      })
    }, 15000)

    return () => clearInterval(contentTimer)
  }, [])

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
      case 'akshami':
      case 'jacia':
        return <Moon className="w-6 h-6" />
      case 'sunrise':
        return <Sunrise className="w-6 h-6" />
      default:
        return <Sun className="w-6 h-6" />
    }
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
           style={{backgroundImage: `url(${mosqueBg})`}}>
        <div className="absolute inset-0 bg-black/40"></div>
        <Card className="w-full max-w-md relative z-10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
              📝 Plotëso Formularin
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
                  🕌 Emri i Xhamise:
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
                  placeholder="Qyteti, shteti..."
                />
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Switch
                  id="showIqamah"
                  checked={formData.showIqamah}
                  onCheckedChange={(checked) => handleInputChange('showIqamah', checked)}
                />
                <Label htmlFor="showIqamah" className="font-medium">Shfaq Ikametin</Label>
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
         style={{backgroundImage: `url(${mosqueBg})`}}>
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Settings button */}
      <button
        onClick={() => {
          console.log('Settings button clicked')
          setShowForm(true)
        }}
        className="fixed top-6 right-6 z-50 p-3 bg-green-600 rounded-lg hover:bg-green-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer border-2 border-green-500 hover:border-green-400"
        style={{ pointerEvents: 'auto' }}
        title="Cilësimet - Kliko për të ndryshuar të dhënat"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* TV Layout Grid */}
      <div className="relative z-10 h-screen flex flex-col">

        {/* Header - Dates */}
        <div className="flex justify-between items-start p-6 pt-8">
          <div className="bg-black/40 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-xl font-bold text-green-400 mb-1">📅 Data Gregoriane</div>
            <div className="text-2xl font-semibold">
              {formatAlbanianDate(currentTime)}
            </div>
          </div>
          <div className="bg-black/40 p-4 rounded-xl backdrop-blur-sm">
            <div className="text-xl font-bold text-orange-400 mb-1">🌙 Data Hixhri</div>
            <div className="text-2xl font-semibold">
              {formatIslamicDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Center Content - Clock and Rotating Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-6">
          {/* Large Clock */}
          <div className="text-center mb-12">
            <div className="text-8xl font-bold mb-2 text-shadow-xl tracking-wider">
              {currentTime.toLocaleTimeString('en-GB')}
            </div>
            <div className="text-2xl font-medium opacity-90 text-shadow-lg">
              Ora Aktuale
            </div>
          </div>

          {/* Quote or Countdown Section */}
          <div className="max-w-5xl w-full">
            {showCountdown ? (
              <div className="text-center bg-gradient-to-r from-yellow-600/80 to-orange-600/80 p-8 rounded-2xl backdrop-blur-enhanced border border-yellow-500/30 shadow-2xl prayer-glow tv-transition">
                <div className="text-2xl font-medium mb-3 text-yellow-100 text-shadow-lg">⏰ Namazi i Ardhshëm</div>
                <p className="text-4xl font-bold mb-2 text-white text-shadow-xl">
                  {nextPrayer.prayer}
                </p>
                <p className="text-3xl font-semibold text-yellow-100 text-shadow-lg">
                  edhe {nextPrayer.time}
                </p>
              </div>
            ) : (
              <div className="bg-black/40 p-8 rounded-2xl backdrop-blur-enhanced border border-white/20 shadow-2xl tv-transition">
                <div className="text-center">
                  <div className="text-xl font-medium mb-4 text-blue-300 text-shadow-lg">📖 Ajeti i Ditës</div>
                  <p className="text-2xl leading-relaxed mb-6 text-white text-shadow-lg">
                    {currentQuote.text}
                  </p>
                  <p className="text-xl opacity-80 text-blue-200 text-shadow-lg">
                    ({currentQuote.source})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom - Prayer Times */}
        <div className="p-6 pb-8">
          <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-enhanced border border-white/20">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-400 text-shadow-lg">
              🕌 Takvimi i Namazit
              {Object.keys(prayerTimesData).length > 0 && (
                <span className="text-sm text-blue-300 ml-3">
                  📊 CSV të ngarkuara ({Object.keys(prayerTimesData).length} ditë)
                </span>
              )}
            </h2>
            <div className="grid grid-cols-6 gap-6">
              {Object.entries(prayerTimes).map(([prayer, time]) => {
                const isCurrentPrayer = getCurrentPrayer() === prayer

                return (
                  <div
                    key={prayer}
                    className={`text-center p-6 rounded-xl tv-transition ${
                      isCurrentPrayer
                        ? 'bg-gradient-to-b from-yellow-500/90 to-orange-600/90 scale-110 shadow-2xl border-2 border-yellow-300 gentle-pulse prayer-glow'
                        : 'bg-black/50 hover:bg-black/60 border border-white/20'
                    }`}
                  >
                    <div className="flex justify-center mb-3">
                      <div className={`p-2 rounded-full ${isCurrentPrayer ? 'bg-white/20' : 'bg-white/10'}`}>
                        {getPrayerIcon(prayer)}
                      </div>
                    </div>
                    <div className={`text-lg font-bold mb-2 text-shadow-lg ${isCurrentPrayer ? 'text-white' : 'text-green-300'}`}>
                      {prayerNames[prayer]}
                    </div>
                    <div className={`text-2xl font-bold text-shadow-lg ${isCurrentPrayer ? 'text-white' : 'text-white'}`}>
                      {time}
                    </div>
                    {isCurrentPrayer && (
                      <div className="text-sm font-medium mt-2 text-yellow-100 animate-pulse text-shadow-lg">
                        ● AKTIVE ●
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Corner Info */}
        {(formData.mosqueName || formData.location) && (
          <div className="absolute bottom-6 left-6 bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🕌</span>
              <div>
                <div className="text-lg font-semibold text-green-400">Xhamia</div>
                <div className="text-base">{formData.mosqueName}</div>
                {formData.location && <div className="text-sm opacity-80">{formData.location}</div>}
              </div>
            </div>
          </div>
        )}

        {formData.imam && (
          <div className="absolute bottom-6 right-6 bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎓</span>
              <div>
                <div className="text-lg font-semibold text-blue-400">Imami</div>
                <div className="text-base">{formData.imam}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

