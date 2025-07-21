import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Settings, Sun, Moon, Sunrise, Sunset } from 'lucide-react'
import mosqueBg from './assets/mosque-bg.jpg'
import { getParisTime, getParisDateString } from './utils/timezone.js'
import { getTodaysPrayerTimes, loadPrayerTimesFromCSV, formatAlbanianDate, loadQuotesFromCSV, albanianQuotes } from './utils/prayerData.js'
import { formatIslamicDate } from './utils/hijri-converter.js'
import './App.css'


const wallpapers = import.meta.glob('./assets/wallpapers/*.jpg', { eager: true, import: 'default' });

function getRandomWallpaper() {
  const wallpaperKeys = Object.keys(wallpapers);
  
  if (wallpaperKeys.length === 0) {
    console.warn('No wallpapers found, using default mosque background');
    return mosqueBg;
  }
  
  const randomKey = wallpaperKeys[Math.floor(Math.random() * wallpaperKeys.length)];
  const selectedWallpaper = wallpapers[randomKey]?.default || wallpapers[randomKey];
  
  if (!selectedWallpaper) {
    console.warn('Selected wallpaper not found, using default mosque background');
    return mosqueBg;
  }
  
  return selectedWallpaper;
}

// Prayer icons mapping
const prayerIcons = {
  imsaku: Moon,
  sunrise: Sunrise,
  dreka: Sun,
  ikindia: Sun,
  akshami: Sunset,
  jacia: Moon
}

// Prayer names in Albanian
const prayerNames = {
  imsaku: 'Imsaku',
  sunrise: 'L. e Diellit',
  dreka: 'Dreka',
  ikindia: 'Ikindia',
  akshami: 'Akshami',
  jacia: 'Jacia'
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [prayerData, setPrayerData] = useState({})
  const [backgroundImage, setBackgroundImage] = useState(() => getRandomWallpaper())
  const [showSettings, setShowSettings] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [currentQuote, setCurrentQuote] = useState(albanianQuotes[0])
  const [quotesData, setQuotesData] = useState(albanianQuotes)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('mosqueFormData')
      return saved ? JSON.parse(saved) : { 
        imam: '', 
        mosqueName: '', 
        location: '', 
        announcementTitle: '',
        announcementContent: ''
      }
    } catch (e) {
      console.error('Error parsing saved form data:', e)
      return { 
        imam: '', 
        mosqueName: '', 
        location: '', 
        announcementTitle: '',
        announcementContent: ''
      }
    }
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('mosqueFormData', JSON.stringify(formData))
    setShowForm(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      localStorage.setItem('mosqueFormData', JSON.stringify(newData))
      return newData
    })
  }

  // Effect for wallpaper rotation every 12 hours
  useEffect(() => {
    const wallpaperTimer = setInterval(() => {
      setBackgroundImage(getRandomWallpaper())
    }, 12 * 60 * 60 * 1000) // 12 hours in milliseconds

    return () => clearInterval(wallpaperTimer)
  }, [])

  // Default prayer times
  const defaultPrayerTimes = {
    imsaku: '03:02',
    sunrise: '05:06',
    dreka: '12:44',
    ikindia: '16:46',
    akshami: '20:15',
    jacia: '22:12'
  }

  const todaysPrayerTimes = getTodaysPrayerTimes(prayerData) || defaultPrayerTimes

  // Get current prayer and next prayer
  const getCurrentPrayer = () => {
    const now = currentTime.toTimeString().slice(0, 5)
    const prayers = Object.entries(todaysPrayerTimes)
    
    for (let i = 0; i < prayers.length; i++) {
      const [name, time] = prayers[i]
      if (now < time) {
        return { current: i > 0 ? prayers[i-1][0] : null, next: name }
      }
    }
    return { current: prayers[prayers.length-1][0], next: prayers[0][0] }
  }

  const { current, next } = getCurrentPrayer()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadPrayerTimesFromCSV().then(data => {
      setPrayerData(data)
    }).catch(error => {
      console.error('Failed to load prayer times:', error)
    })
  }, [])

  // Load quotes from CSV
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const quotes = await loadQuotesFromCSV()
        setQuotesData(quotes)
        setCurrentQuote(quotes[0] || albanianQuotes[0])
      } catch (error) {
        console.error('Failed to load quotes:', error)
        setQuotesData(albanianQuotes)
      }
    }
    loadQuotes()
  }, [])

  // Rotate between countdown and quotes every 55 seconds
  useEffect(() => {
    const contentTimer = setInterval(() => {
      setShowCountdown(prev => {
        if (!prev) {
          setCurrentQuote(quotesData[Math.floor(Math.random() * quotesData.length)])
        }
        return !prev
      })
    }, 55000) // 55 seconds

    return () => clearInterval(contentTimer)
  }, [quotesData])

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

              <div className="space-y-2 mt-6 pt-4 border-t border-gray-200">
                <Label htmlFor="announcementTitle" className="text-purple-600 font-semibold flex items-center gap-2">
                  📢 Titulli i njoftimit:
                </Label>
                <Input
                  id="announcementTitle"
                  value={formData.announcementTitle}
                  onChange={(e) => handleInputChange('announcementTitle', e.target.value)}
                  className="border-purple-500 focus:border-purple-600 transition-colors"
                  placeholder="p.sh. Njoftim i rëndësishëm..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="announcementContent" className="text-purple-600 font-semibold flex items-center gap-2">
                  📝 Përmbajtja e njoftimit:
                </Label>
                <textarea
                  id="announcementContent"
                  value={formData.announcementContent}
                  onChange={(e) => handleInputChange('announcementContent', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-purple-500 focus:border-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Shkruani njoftimin tuaj këtu..."
                  rows="4"
                />
              </div>

              <div className="text-sm text-gray-500">
                Copyright © <a href="https://takvimi.app" className="text-blue-500 hover:text-blue-600">Takvimi.app</a> - All rights reserved
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 transition-colors">
                  ✅ Ruaji të dhënat
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setFormData({ 
                      imam: '', 
                      mosqueName: '', 
                      location: '', 
                      announcementTitle: '',
                      announcementContent: ''
                    });
                    localStorage.removeItem('mosqueFormData');
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 transition-colors"
                >
                  🗑️ Pastro të dhënat
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative transition-all duration-1000"
      style={{ 
        backgroundImage: `url(${backgroundImage || mosqueBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 p-8 text-white min-h-screen flex flex-col">
        {/* Top Bar with Dates */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-lg font-medium text-shadow-lg">
            {formatAlbanianDate(currentTime)}
          </div>
          <div className="text-lg font-medium text-shadow-lg">
            {formatIslamicDate(currentTime)}
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-2">
          {/* Large Clock */}
          <div className="text-center mb-4">
            <div className="text-8xl font-mono font-bold text-shadow-xl tracking-wider">
              {currentTime.toLocaleTimeString('en-GB')}
            </div>
          </div>
          <div className="max-w-4xl w-full">
            {showCountdown ? (
              <div className="text-center w-full p-4 rounded-2xl backdrop-transparent border border-yellow-500/30 shadow-2xl prayer-glow tv-transition">
                <div className="text-xl font-medium mb-2 text-yellow-100 text-shadow-lg">⏳ Vakti i ardhshëm</div>
                <p className="text-3xl font-bold mb-1 text-white text-shadow-xl">
                  {prayerNames[next]}
                </p>
                <p className="text-2xl font-semibold text-yellow-100 text-shadow-lg">
                  edhe {(() => {
                    // Calculate time until next prayer
                    const now = currentTime;
                    const nextTimeStr = todaysPrayerTimes[next];
                    if (!nextTimeStr) return '-';

                    // Parse next prayer time
                    const [h, m] = nextTimeStr.split(':').map(Number);
                    const nextPrayerDate = new Date(now);
                    nextPrayerDate.setHours(h, m, 0, 0);

                    // If next prayer is earlier than now, it's for the next day
                    if (nextPrayerDate <= now) {
                      nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
                    }

                    const diffMs = nextPrayerDate - now;
                    if (diffMs < 0) return '-';

                    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffM = Math.floor((diffMs / (1000 * 60)) % 60);
                    const diffS = Math.floor((diffMs / 1000) % 60);

                    return `${diffH > 0 ? diffH + ' orë ' : ''}${diffM} minuta ${diffS} sekonda`;
                  })()}
                </p>
              </div>  
            ) : (
              <div className="text-center w-full p-4 rounded-2xl backdrop-transparent border border-yellow-500/30 shadow-2xl prayer-glow tv-transition">
                {formData.announcementContent ? (
                  <>
                    <p className="text-3xl font-bold mb-1 text-white text-shadow-xl">
                      {formData.announcementContent}
                    </p>
                    {formData.announcementTitle && (
                      <p className="text-lg font-semibold text-yellow-100 text-shadow-lg">
                        - {formData.announcementTitle}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold mb-1 text-white text-shadow-xl">
                      {currentQuote.text}
                    </p>
                    <p className="text-lg font-semibold text-yellow-100 text-shadow-lg">
                      - {currentQuote.source}
                    </p>
                  </>
                )}
              </div>
            )}            
          </div>
        </div>  
        {/* Info Row - Mosque and Imam */}
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
        {/* Bottom Prayer Times */}
          <div className="grid grid-cols-6 gap-4">
            {Object.entries(todaysPrayerTimes).map(([prayer, time]) => {
              const Icon = prayerIcons[prayer] || Sun;
              const isActive = prayer === current;
              const isNext = prayer === next;
              
              return (
                <Card 
                  key={prayer} 
                  className={`bg-black/10 backdrop-blur-sm border-2 transition-all duration-300 ${
                    isActive ? 'border-green-400 prayer-glow' : 
                    isNext ? 'border-orange-400 gentle-pulse prayer-glow tv-transition' : 'border-white/10'
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2 opacity-30 text-white text-shadow-sm" />
                    <div className="text-lg text-white/70 font-medium mb-1">{prayerNames[prayer]}</div>
                    <div className="text-3xl text-white/90 text-shadow-md font-bold">{time}</div>
                    {prayer === 'imsaku' && (
                      <div className="text-xs text-white/70 mt-1 opacity-70">Sabahu: 3:22</div>
                    )}
                    {isActive && (
                      <div className="text-xs mt-1 text-green-400">● AKTUAL ●</div>
                    )}
                    {isNext && (
                      <div className="text-xs mt-1 text-orange-400">● I ARDHSHËM ●</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        

        {/* Settings button stays fixed at bottom right */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 z-50 p-3 bg-green-600 rounded-lg hover:bg-blue-700 hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer border-2 border-green-500 hover:border-blue-400"
          style={{ pointerEvents: 'auto' }}
          title="Cilësimet- Kliko për të ndryshuar të dhënat"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default App

