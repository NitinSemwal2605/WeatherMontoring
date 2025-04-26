import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { 
  getCurrentWeatherByCity, 
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByCoords
} from '../api/weatherService'

const WeatherContext = createContext()

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [units, setUnits] = useState('metric') // metric or imperial
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  
  // Load recent searches from local storage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (err) {
        console.error('Error parsing recent searches', err)
      }
    }
  }, [])
  
  // Save recent searches to local storage
  useEffect(() => {
    if (recentSearches.length) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches))
    }
  }, [recentSearches])
  
  // Fetch weather data by city name
  const searchCity = useCallback(async (city) => {
    if (!city) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const weatherData = await getCurrentWeatherByCity(city, units)
      setCurrentWeather(weatherData)
      
      const forecastData = await getForecastByCity(city, units)
      setForecast(forecastData)
      
      // Add to recent searches only if the city was found
      setRecentSearches(prev => {
        const newSearches = prev.filter(item => item !== city)
        return [city, ...newSearches].slice(0, 5)
      })
      
    } catch (err) {
      // More user-friendly error message for city not found
      if (err.message?.toLowerCase().includes('city not found')) {
        setError('City not found. Please check the spelling and try again.')
      } else {
        setError('Unable to fetch weather data. Please try again later.')
      }
      console.error('Error fetching weather data:', err)
      
      // Clear current weather and forecast data on error
      setCurrentWeather(null)
      setForecast(null)
    } finally {
      setIsLoading(false)
    }
  }, [units])
  
  // Fetch weather data by coordinates
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    if (!lat || !lon) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const weatherData = await getCurrentWeatherByCoords(lat, lon, units)
      setCurrentWeather(weatherData)
      
      const forecastData = await getForecastByCoords(lat, lon, units)
      setForecast(forecastData)
      
      // Add to recent searches
      setRecentSearches(prev => {
        const cityName = weatherData.name
        const newSearches = prev.filter(item => item !== cityName)
        return [cityName, ...newSearches].slice(0, 5)
      })
      
    } catch (err) {
      setError('Unable to fetch weather data for this location. Please try again later.')
      console.error('Error fetching weather data:', err)
      
      // Clear current weather and forecast data on error
      setCurrentWeather(null)
      setForecast(null)
    } finally {
      setIsLoading(false)
    }
  }, [units])
  
  // Toggle units between metric and imperial
  const toggleUnits = useCallback(() => {
    setUnits(prev => {
      const newUnits = prev === 'metric' ? 'imperial' : 'metric'
      
      // Re-fetch weather data with new units
      if (currentWeather) {
        const { coord } = currentWeather
        fetchWeatherByCoords(coord.lat, coord.lon, newUnits)
      }
      
      return newUnits
    })
  }, [currentWeather, fetchWeatherByCoords])
  
  const contextValue = {
    currentWeather,
    forecast,
    isLoading,
    error,
    units,
    recentSearches,
    searchCity,
    fetchWeatherByCoords,
    toggleUnits
  }
  
  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  )
}