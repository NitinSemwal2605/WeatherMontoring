import { motion } from 'framer-motion'
import { 
  WiHumidity, 
  WiStrongWind, 
  WiBarometer,
  WiSunrise,
  WiSunset
} from 'react-icons/wi'
import { useWeather } from '../context/WeatherContext'
import { 
  formatTemperature, 
  formatWindSpeed, 
  formatTime,
  getWeatherDescription
} from '../utils/weatherUtils'
import WeatherIcon from './WeatherIcon'

const CurrentWeather = () => {
  const { currentWeather, units } = useWeather()
  
  if (!currentWeather) return null
  
  const temp = currentWeather.main.temp
  const feelsLike = currentWeather.main.feels_like
  const description = currentWeather.weather[0].description
  const weatherId = currentWeather.weather[0].id
  const isDay = currentWeather.sys.day
  
  const weatherVariants = {
    initial: { 
      opacity: 0,
      scale: 0.9 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  }
  
  return (
    <motion.div
      variants={weatherVariants}
      initial="initial"
      animate="animate"
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Main weather info */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white shaded-text mb-1">
              {currentWeather.name}, {currentWeather.sys.country}
            </h2>
            <p className="text-white/80 capitalize">
              {getWeatherDescription(currentWeather.weather[0], temp)}
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="text-6xl md:text-7xl text-white font-medium shaded-text">
              {formatTemperature(temp, units)}
            </div>
            <div className="ml-4 md:ml-6">
              <WeatherIcon weatherId={weatherId} isDay={isDay} size="large" />
            </div>
          </div>
        </div>
        
        {/* Weather details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-white">
          <div className="flex items-center">
            <WiHumidity className="text-3xl text-white/80 mr-2" />
            <div>
              <p className="text-white/70 text-sm">Humidity</p>
              <p className="font-medium">{currentWeather.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <WiStrongWind className="text-3xl text-white/80 mr-2" />
            <div>
              <p className="text-white/70 text-sm">Wind</p>
              <p className="font-medium">{formatWindSpeed(currentWeather.wind.speed, units)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <WiBarometer className="text-3xl text-white/80 mr-2" />
            <div>
              <p className="text-white/70 text-sm">Pressure</p>
              <p className="font-medium">{currentWeather.main.pressure} hPa</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-white/80 mr-2 w-6 h-6 flex items-center justify-center">
              <span className="text-lg">°</span>
            </div>
            <div>
              <p className="text-white/70 text-sm">Feels Like</p>
              <p className="font-medium">{formatTemperature(feelsLike, units)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sunrise/sunset */}
      <div className="glass bg-white/5 p-4 flex justify-between">
        <div className="flex items-center">
          <WiSunrise className="text-2xl text-white/90 mr-1" />
          <div>
            <p className="text-white/70 text-xs">Sunrise</p>
            <p className="text-white font-medium">{formatTime(currentWeather.sys.sunrise)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <WiSunset className="text-2xl text-white/90 mr-1" />
          <div>
            <p className="text-white/70 text-xs">Sunset</p>
            <p className="text-white font-medium">{formatTime(currentWeather.sys.sunset)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CurrentWeather