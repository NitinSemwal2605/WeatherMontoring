import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WiStrongWind } from 'react-icons/wi'
import { useWeather } from '../context/WeatherContext'
import { getAirQuality } from '../api/weatherService'

const AirQuality = () => {
  const { currentWeather } = useWeather()
  const [aqi, setAqi] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchAQI = async () => {
      if (!currentWeather) return
      
      try {
        const { coord } = currentWeather
        const data = await getAirQuality(coord.lat, coord.lon)
        setAqi(data.list[0])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching AQI:', error)
        setLoading(false)
      }
    }
    
    fetchAQI()
  }, [currentWeather])
  
  if (loading || !aqi) return null
  
  const getAQILevel = (aqi) => {
    switch (aqi) {
      case 1: return { level: 'Good', color: 'text-green-400' }
      case 2: return { level: 'Fair', color: 'text-yellow-400' }
      case 3: return { level: 'Moderate', color: 'text-orange-400' }
      case 4: return { level: 'Poor', color: 'text-red-400' }
      case 5: return { level: 'Very Poor', color: 'text-purple-400' }
      default: return { level: 'Unknown', color: 'text-gray-400' }
    }
  }
  
  const getHealthTip = (aqi) => {
    switch (aqi) {
      case 1:
        return "Perfect air quality for outdoor activities!"
      case 2:
        return "Air quality is acceptable, but sensitive individuals should limit prolonged outdoor exposure."
      case 3:
        return "People with respiratory issues should limit outdoor activities."
      case 4:
        return "Avoid prolonged outdoor activities. Wear a mask if necessary."
      case 5:
        return "Stay indoors and keep windows closed. Use air purifiers if available."
      default:
        return "No health tips available."
    }
  }
  
  const { level, color } = getAQILevel(aqi.main.aqi)
  const healthTip = getHealthTip(aqi.main.aqi)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-white shaded-text mb-4">Air Quality</h2>
      
      <div className="glass rounded-xl p-6">
        <div className="flex items-center mb-4">
          <WiStrongWind className="text-4xl text-white mr-3" />
          <div>
            <p className="text-white text-lg font-medium">Air Quality Index</p>
            <p className={`text-2xl font-bold ${color}`}>{level}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-white/70 mb-1">Health Advice:</p>
            <p className="text-white">{healthTip}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-sm">PM2.5</p>
              <p className="text-white font-medium">{aqi.components.pm2_5.toFixed(1)} μg/m³</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">PM10</p>
              <p className="text-white font-medium">{aqi.components.pm10.toFixed(1)} μg/m³</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AirQuality