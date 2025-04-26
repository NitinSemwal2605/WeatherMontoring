import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'

const LocationInfo = () => {
  const { currentWeather } = useWeather()
  
  if (!currentWeather) return null
  
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.1
      }
    }
  }
  
  // Check if it's night time
  const isNight = !currentWeather.sys.day
  
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="mb-6 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white shaded-text">
        {currentWeather.name}, {currentWeather.sys.country}
      </h1>
      <p className="text-white/80 mt-2 text-lg">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p className="mt-1 text-white/70">
        {isNight ? 'Good Evening' : 
          (new Date().getHours() < 12 ? 'Good Morning' : 'Good Afternoon')}
      </p>
    </motion.div>
  )
}

export default LocationInfo