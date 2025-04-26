import { useEffect, useState } from 'react'
import RainAnimation from './RainAnimation'
import SnowAnimation from './SnowAnimation'
import CloudsAnimation from './CloudsAnimation'
import SunnyAnimation from './SunnyAnimation'
import ThunderstormAnimation from './ThunderstormAnimation'
import FogAnimation from './FogAnimation'

const WeatherAnimation = ({ weatherCode }) => {
  const [animationType, setAnimationType] = useState(null)
  
  useEffect(() => {
    if (!weatherCode) return
    
    // Determine animation based on weather code
    if (weatherCode >= 200 && weatherCode < 300) {
      setAnimationType('thunderstorm')
    } else if ((weatherCode >= 300 && weatherCode < 400) || 
              (weatherCode >= 500 && weatherCode < 600)) {
      setAnimationType('rain')
    } else if (weatherCode >= 600 && weatherCode < 700) {
      setAnimationType('snow')
    } else if (weatherCode >= 700 && weatherCode < 800) {
      setAnimationType('fog')
    } else if (weatherCode === 800) {
      setAnimationType('clear')
    } else if (weatherCode > 800) {
      setAnimationType('clouds')
    }
  }, [weatherCode])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {animationType === 'rain' && <RainAnimation />}
      {animationType === 'snow' && <SnowAnimation />}
      {animationType === 'clouds' && <CloudsAnimation />}
      {animationType === 'clear' && <SunnyAnimation />}
      {animationType === 'thunderstorm' && <ThunderstormAnimation />}
      {animationType === 'fog' && <FogAnimation />}
    </div>
  )
}

export default WeatherAnimation