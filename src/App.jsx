import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Settings, Sun, Moon, Sunrise } from 'lucide-react'
import mosqueBg from './assets/mosque-bg.jpg'
import { albanianQuotes, formatAlbanianDate, prayerNames } from './utils/prayerData.js'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(() => {
    // Show form initially only if no data is saved
    const saved = localStorage.getItem('mosqueFormData')
    return !saved
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCountdown, setShowCountdown] = useState(false)
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

  // Prayer times data (can be loaded from CSV)
  const prayerTimes = {
    imsaku: '02:47',
    sunrise: '04:59', 
    dreka: '12:44',
    ikindia: '16:47',
    akshami: '20:22',
    jacia: '22:24'
  }

  const [currentQuote, setCurrentQuote] = useState(albanianQuotes[0])

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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-white relative" 
         style={{backgroundImage: `url(${mosqueBg})`}}>
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Settings button */}
      <button
        onClick={() => {
          console.log('Settings button clicked')
          setShowForm(true)
        }}
        className="fixed top-4 right-4 z-50 p-3 bg-green-600 rounded-lg hover:bg-green-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer border-2 border-green-500 hover:border-green-400"
        style={{ pointerEvents: 'auto' }}
        title="Cilësimet - Kliko për të ndryshuar të dhënat"
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="relative z-10 p-8">
        {/* Current Time */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-4 text-shadow-lg">
            {currentTime.toLocaleTimeString('en-GB')}
          </div>
        </div>

        {/* Quote or Countdown Section */}
        <div className="max-w-4xl mx-auto mb-8 min-h-[200px] flex items-center justify-center">
          {showCountdown ? (
            <div className="text-center bg-black/30 p-6 rounded-xl backdrop-blur-sm">
              <p className="text-3xl font-bold mb-2">
                {nextPrayer.prayer} edhe {nextPrayer.time}
              </p>
            </div>
          ) : (
            <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm">
              
              <p className="text-2xl leading-relaxed mb-4">
                {currentQuote.text}
              </p>
              <p className="text-lg opacity-80 text-right">
                ({currentQuote.source})
              </p>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
          <div className="text-lg font-medium">
            {formatAlbanianDate(currentTime)}
          </div>
          <div className="text-lg font-medium">
            15/ Muharrem /1447 AH
          </div>
        </div>

        {/* Prayer Times */}
        <div className="grid grid-cols-6 gap-4 max-w-6xl mx-auto">
          {Object.entries(prayerTimes).map(([prayer, time]) => {
            const isCurrentPrayer = getCurrentPrayer() === prayer
            
            return (
              <div 
                key={prayer}
                className={`text-center p-4 rounded-lg transition-all duration-300 ${
                  isCurrentPrayer 
                    ? 'bg-yellow-600/90 scale-105 shadow-lg' 
                    : 'bg-black/40 hover:bg-black/50'
                }`}
              >
                <div className="flex justify-center mb-2">
                  {getPrayerIcon(prayer)}
                </div>
                <div className="text-lg font-semibold mb-1">
                  {prayerNames[prayer]}
                </div>
                <div className="text-xl font-bold">
                  {time}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mosque Info */}
        {(formData.mosqueName || formData.location) && (
          <div className="absolute bottom-4 left-4 text-sm bg-black/40 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <span>🕌</span>
              <span>{formData.mosqueName} - {formData.location}</span>
            </div>
          </div>
        )}
        
        {formData.imam && (
          <div className="absolute bottom-4 right-4 text-sm bg-black/40 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <span>🎓</span>
              <span>Imami: {formData.imam}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

