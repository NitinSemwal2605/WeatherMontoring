import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useWeather } from './context/WeatherContext'
import Header from './components/Header'
import Home from './pages/Home'
import ForecastPage from './pages/ForecastPage'
import WeatherAnimation from './components/animations/WeatherAnimation'
import './App.css'

function App() {
  const { currentWeather, fetchWeatherByCoords, isLoading } = useWeather()
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherByCoords(latitude, longitude)
          setLocationError('')
        },
        (error) => {
          let errorMessage = 'Unable to get your location. Showing weather for New York.'
          
          // Provide more specific error messages based on the error code
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. To see weather for your location, please enable location services in your browser settings. Currently showing weather for New York.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Showing weather for New York.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Showing weather for New York.'
              break
          }
          
          setLocationError(errorMessage)
          // Default to New York if geolocation fails
          fetchWeatherByCoords(40.7128, -74.0060)
        }
      )
    } else {
      // Geolocation not supported
      setLocationError('Geolocation is not supported by your browser. Showing weather for New York.')
      fetchWeatherByCoords(40.7128, -74.0060)
    }

    // Fix for mobile viewport height issue
    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()

    return () => window.removeEventListener('resize', appHeight)
  }, [fetchWeatherByCoords])

  // Determine weather background class based on current weather
  const getWeatherBgClass = () => {
    if (!currentWeather) return 'weather-bg weather-bg-cloudy'
    
    const weatherId = currentWeather.weather[0].id
    const isNight = !currentWeather.sys.day
    
    if (isNight) return 'weather-bg weather-bg-night'
    
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) return 'weather-bg weather-bg-stormy' // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return 'weather-bg weather-bg-rainy' // Drizzle
    if (weatherId >= 500 && weatherId < 600) return 'weather-bg weather-bg-rainy' // Rain
    if (weatherId >= 600 && weatherId < 700) return 'weather-bg weather-bg-snowy' // Snow
    if (weatherId >= 800) return 'weather-bg weather-bg-sunny' // Clear
    
    return 'weather-bg weather-bg-cloudy' // Clouds and other conditions
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {currentWeather && (
        <>
          <div className={getWeatherBgClass()}></div>
          <WeatherAnimation weatherCode={currentWeather.weather[0].id} />
        </>
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container mx-auto p-4">
          {locationError && (
            <div className="mb-4">
              <div className="glass p-4 rounded-xl">
                <p className="text-white">{locationError}</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="glass p-6 rounded-xl animate-pulse-slow">
                <p className="text-white font-medium text-lg">Loading weather data...</p>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forecast" element={<ForecastPage />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  )
}

export default App