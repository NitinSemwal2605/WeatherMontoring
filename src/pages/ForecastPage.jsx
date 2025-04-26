import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import DailyForecast from '../components/DailyForecast'
import { 
  formatDate, 
  groupForecastByDay, 
  getDailySummary 
} from '../utils/weatherUtils'
import WeatherIcon from '../components/WeatherIcon'

const ForecastPage = () => {
  const { forecast, currentWeather } = useWeather()
  
  if (!forecast || !forecast.list || !currentWeather) {
    return <div className="text-white">Loading forecast data...</div>
  }
  
  // Group forecast by day
  const groupedForecast = groupForecastByDay(forecast.list)
  
  // Get the keys (days) and convert to Date objects for sorting
  const days = Object.keys(groupedForecast)
    .map(day => new Date(day))
    .sort((a, b) => a - b)
    .map(date => date.toDateString())
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-4"
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white shaded-text">
          7-Day Weather Forecast
        </h1>
        <p className="text-white/80 mt-2">
          {currentWeather.name}, {currentWeather.sys.country}
        </p>
      </div>
      
      <div className="mb-10">
        <DailyForecast limit={7} />
      </div>
      
      {/* Detailed Daily Forecast */}
      {days.slice(1, 8).map(day => {
        const dayData = groupedForecast[day]
        const dailySummary = getDailySummary(dayData)
        
        return (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 glass rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-white shaded-text">
                {formatDate(dailySummary.date)}
              </h2>
              <div className="flex items-center mt-1">
                <WeatherIcon weatherId={dailySummary.weather.id} isDay={true} />
                <p className="ml-2 text-white/80 capitalize">
                  {dailySummary.weather.description}
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap">
                {dayData.map((hourData, index) => {
                  const time = new Date(hourData.dt * 1000)
                  const hour = time.getHours()
                  
                  // Only show every 3 hours
                  if (index % 2 !== 0 && index !== 0) return null
                  
                  return (
                    <div 
                      key={hourData.dt} 
                      className="w-1/2 md:w-1/4 p-2"
                    >
                      <div className="glass rounded-xl p-3 text-center">
                        <p className="text-white text-sm font-medium mb-1">
                          {hour === 0 ? '12 AM' : 
                           hour === 12 ? '12 PM' : 
                           hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </p>
                        <WeatherIcon 
                          weatherId={hourData.weather[0].id} 
                          isDay={hour > 6 && hour < 18} 
                          size="small"
                        />
                        <p className="text-white mt-1 font-medium">
                          {Math.round(hourData.main.temp)}°
                        </p>
                        <p className="text-white/70 text-xs mt-1">
                          {Math.round(hourData.wind.speed)} m/s
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default ForecastPage