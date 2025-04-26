import { motion } from 'framer-motion'
import { 
  WiBarometer, 
  WiHumidity, 
  WiStrongWind, 
  WiThermometer,
  WiRaindrop,
  WiCloud,
  WiDayCloudyHigh
} from 'react-icons/wi'
import { useWeather } from '../context/WeatherContext'
import { formatWindSpeed } from '../utils/weatherUtils'

const WeatherDetails = () => {
  const { currentWeather, units } = useWeather()
  
  if (!currentWeather) return null
  
  const detailItems = [
    {
      label: 'Real Feel',
      value: `${Math.round(currentWeather.main.feels_like)}°`,
      icon: <WiThermometer />
    },
    {
      label: 'Humidity',
      value: `${currentWeather.main.humidity}%`,
      icon: <WiHumidity />
    },
    {
      label: 'Wind',
      value: formatWindSpeed(currentWeather.wind.speed, units),
      icon: <WiStrongWind />
    },
    {
      label: 'Pressure',
      value: `${currentWeather.main.pressure} hPa`,
      icon: <WiBarometer />
    },
    {
      label: 'Cloudiness',
      value: `${currentWeather.clouds.all}%`,
      icon: <WiCloud />
    },
    {
      label: 'Visibility',
      value: `${(currentWeather.visibility / 1000).toFixed(1)} km`,
      icon: <WiDayCloudyHigh />
    }
  ]
  
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.3
      }
    }
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-white shaded-text mb-4">Weather Details</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {detailItems.map((item, index) => (
          <div
            key={index}
            className="glass rounded-xl p-4 flex flex-col items-center justify-center text-center"
          >
            <div className="text-3xl text-white/80 mb-2">
              {item.icon}
            </div>
            <p className="text-white/70 text-sm mb-1">{item.label}</p>
            <p className="text-white font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default WeatherDetails