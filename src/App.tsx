import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThunderstorm, WiFog, WiNightClear } from 'react-icons/wi'
import axios from 'axios'
import WeatherBackground from './WeatherBackground'

interface WeatherData {
  main: {
    temp: number
    humidity: number
    feels_like: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  name: string
  sys: {
    sunrise: number
    sunset: number
  }
  coord: {
    lon: number
    lat: number
  }
}

function App() {
  const [city, setCity] = useState('London')
  const [searchCity, setSearchCity] = useState('London')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [lastWeather, setLastWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDay, setIsDay] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await axios.get(WEATHER_API_URL)
        setWeather(response.data as WeatherData)
        setLastWeather(response.data as WeatherData)
        setError('')
        const now = Math.floor(Date.now() / 1000)
        setIsDay(now > response.data.sys.sunrise && now < response.data.sys.sunset)
      } catch (err) {
        console.error('API Error:', err)
        setError('City not found. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [searchCity])

  const handleSearch = () => {
    setSearchCity(city)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClearInput = () => {
    setCity('')
    inputRef.current?.focus()
  }

  const getWeatherIcon = (weatherMain: string) => {
    const iconSize = "text-8xl"
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return isDay ? 
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <WiDaySunny className={iconSize} />
          </motion.div> :
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <WiNightClear className={iconSize} />
          </motion.div>
      case 'rain':
        return <motion.div
          initial={{ y: -10 }}
          animate={{ y: 10 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <WiRain className={iconSize} />
        </motion.div>
      case 'snow':
        return <motion.div
          initial={{ y: -10, rotate: 0 }}
          animate={{ y: 10, rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <WiSnow className={iconSize} />
        </motion.div>
      case 'thunderstorm':
        return <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <WiThunderstorm className={iconSize} />
        </motion.div>
      case 'mist':
      case 'fog':
        return <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <WiFog className={iconSize} />
        </motion.div>
      default:
        return <motion.div
          initial={{ x: -10 }}
          animate={{ x: 10 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <WiCloudy className={iconSize} />
        </motion.div>
    }
  }

  const getBackgroundGradient = (weather: WeatherData | null) => {
    if (!weather) return { className: 'from-primary to-secondary', style: {} }
    
    const weatherMain = weather.weather[0].main.toLowerCase()
    const desc = weather.weather[0].description ? weather.weather[0].description.toLowerCase() : '';
    const isRain = weatherMain === 'rain' || (desc.includes('rain') && !desc.includes('drizzle'));
    const isHeavyRain = isRain && (desc.includes('heavy') || desc.includes('intensity'));
    if (isRain) {
      return isHeavyRain
        ? { className: '', style: { background: 'linear-gradient(to bottom, #141E30, #243B55)' } }
        : { className: '', style: { background: 'linear-gradient(to bottom, #232526, #414345)' } }
    }
    if (isDay) {
      switch (weatherMain) {
        case 'clear':
          return { className: 'from-blue-400 to-blue-600', style: {} }
        case 'snow':
          return { className: 'from-blue-200 to-blue-400', style: {} }
        case 'thunderstorm':
          return { className: 'from-gray-600 to-gray-800', style: {} }
        case 'mist':
        case 'fog':
          return { className: 'from-gray-300 to-gray-500', style: {} }
        default:
          return { className: 'from-blue-300 to-blue-500', style: {} }
      }
    } else {
      switch (weatherMain) {
        case 'clear':
          return { className: 'from-indigo-900 to-purple-900', style: {} }
        case 'snow':
          return { className: 'from-blue-900 to-indigo-900', style: {} }
        case 'thunderstorm':
          return { className: 'from-gray-900 to-black', style: {} }
        case 'mist':
        case 'fog':
          return { className: 'from-gray-700 to-gray-900', style: {} }
        default:
          return { className: 'from-indigo-800 to-purple-800', style: {} }
      }
    }
  }

  const bg = getBackgroundGradient(lastWeather);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000 bg-gradient-to-br relative overflow-hidden ${bg.className}`}
      style={bg.style}
    >
      {/* Animated Weather Background */}
      {lastWeather ? (
        <WeatherBackground 
          weatherMain={lastWeather.weather[0].main.toLowerCase()} 
          isDay={isDay} 
          weatherDescription={lastWeather.weather[0].description}
        />
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0, scale: [1, 1.08, 1] }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
        className="w-full max-w-xl mx-auto text-center z-10"
      >
        <h1 className="heading text-5xl md:text-6xl font-extrabold mb-2 text-accent drop-shadow-lg">VibeWeather</h1>
        <div className="text-lg md:text-xl mb-8 text-white/80 font-semibold tracking-wide">Weather with a vibe. Search any city!</div>
      </motion.div>
      {/* Search Bar Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-2xl p-6 mb-8 w-full max-w-xl mx-auto z-10 shadow-lg"
      >
        <div className="flex gap-4 mb-0 relative">
          <div className="flex-1 relative">
            <motion.input
              ref={inputRef}
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-accent text-lg"
            />
            {city && (
              <button
                onClick={handleClearInput}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
                tabIndex={-1}
              >
                ×
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-6 py-3 bg-accent rounded-lg font-semibold text-lg shadow"
          >
            Search
          </motion.button>
        </div>
      </motion.div>
      {/* Weather Card */}
      {lastWeather && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-8 w-full max-w-2xl mx-auto z-10 shadow-xl flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto"
                />
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-red-400 text-center"
              >
                {error}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col md:flex-row gap-8 items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-effect rounded-xl p-8 flex flex-col items-center w-full md:w-1/2"
                >
                  <h2 className="text-2xl font-bold mb-4 heading text-white/90 drop-shadow">{lastWeather.name}</h2>
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(lastWeather.weather[0].main)}
                    <div>
                      <motion.p
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-extrabold heading text-white drop-shadow"
                      >
                        {Math.round(lastWeather.main.temp)}°C
                      </motion.p>
                      <p className="text-lg text-white/70 capitalize">{lastWeather.weather[0].description}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-effect rounded-xl p-8 flex flex-col items-center w-full md:w-1/2"
                >
                  <h3 className="text-xl font-semibold mb-4 heading text-white/80">Weather Details</h3>
                  <div className="space-y-2 text-lg">
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Feels like: {Math.round(lastWeather.main.feels_like)}°C
                    </motion.p>
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Humidity: {lastWeather.main.humidity}%
                    </motion.p>
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Wind Speed: {lastWeather.wind.speed} m/s
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

export default App 