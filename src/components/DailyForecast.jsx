import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import WeatherIcon from './WeatherIcon'
import { 
  formatTemperature, 
  formatDate, 
  groupForecastByDay, 
  getDailySummary 
} from '../utils/weatherUtils'

const DailyForecast = ({ limit = 5 }) => {
  const { forecast, units } = useWeather()
  
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return null
  }
  
  // Group forecast by day
  const groupedForecast = groupForecastByDay(forecast.list)
  
  // Get daily summaries
  const dailySummaries = Object.values(groupedForecast)
    .map(dayForecasts => getDailySummary(dayForecasts))
    .slice(1, limit + 1) // Skip today, show next 5 days
  
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white shaded-text mb-4">
        {limit === 5 ? '5-Day' : '7-Day'} Forecast
      </h2>
      
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        {dailySummaries.map((day, index) => (
          <motion.div
            key={day.date}
            variants={itemVariants}
            className="glass rounded-xl p-4 forecast-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WeatherIcon weatherId={day.weather.id} isDay={true} />
                <div className="ml-3">
                  <p className="text-white font-semibold">{formatDate(day.date)}</p>
                  <p className="text-white/70 capitalize">{day.weather.description}</p>
                </div>
              </div>
              
              <div className="flex gap-3 text-white">
                <span className="font-medium">{formatTemperature(day.maxTemp, units)}</span>
                <span className="text-white/70">{formatTemperature(day.minTemp, units)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DailyForecast