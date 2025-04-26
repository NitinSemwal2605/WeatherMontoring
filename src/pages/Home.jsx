import { motion } from 'framer-motion'
import LocationInfo from '../components/LocationInfo'
import CurrentWeather from '../components/CurrentWeather'
import HourlyForecast from '../components/HourlyForecast'
import DailyForecast from '../components/DailyForecast'
import WeatherDetails from '../components/WeatherDetails'
import AirQuality from '../components/AirQuality'
import WeatherChart from '../components/WeatherChart'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col max-w-4xl mx-auto py-4"
    >
      <LocationInfo />
      <CurrentWeather />
      <HourlyForecast />
      <WeatherChart />
      <DailyForecast limit={3} />
      <AirQuality />
      <WeatherDetails />
    </motion.div>
  )
}

export default Home