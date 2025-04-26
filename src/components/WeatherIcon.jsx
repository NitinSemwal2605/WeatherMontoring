import { 
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloudy,
  WiRain,
  WiDayRain,
  WiNightAltRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi'

const WeatherIcon = ({ weatherId, isDay = true, size = 'medium' }) => {
  // Size classes
  const sizeClasses = {
    small: 'text-3xl',
    medium: 'text-4xl',
    large: 'text-6xl',
    xl: 'text-8xl'
  }
  
  // Get the appropriate icon based on weather ID and day/night
  const getIcon = () => {
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return <WiThunderstorm />
    }
    
    // Drizzle & Rain
    if (weatherId >= 300 && weatherId < 600) {
      if (isDay) {
        return <WiDayRain />
      }
      return <WiNightAltRain />
    }
    
    // Snow
    if (weatherId >= 600 && weatherId < 700) {
      return <WiSnow />
    }
    
    // Atmosphere (fog, mist, etc.)
    if (weatherId >= 700 && weatherId < 800) {
      return <WiFog />
    }
    
    // Clear
    if (weatherId === 800) {
      if (isDay) {
        return <WiDaySunny />
      }
      return <WiNightClear />
    }
    
    // Clouds
    if (weatherId > 800) {
      if (weatherId === 801 || weatherId === 802) {
        if (isDay) {
          return <WiDayCloudy />
        }
        return <WiNightAltCloudy />
      }
      return <WiCloudy />
    }
    
    // Default
    return isDay ? <WiDaySunny /> : <WiNightClear />
  }
  
  return (
    <div className={`text-white ${sizeClasses[size]} animate-float`}>
      {getIcon()}
    </div>
  )
}

export default WeatherIcon