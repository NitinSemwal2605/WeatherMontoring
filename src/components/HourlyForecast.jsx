import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import WeatherIcon from './WeatherIcon'
import { formatTemperature } from '../utils/weatherUtils'

const HourlyForecast = () => {
  const { forecast, units } = useWeather()
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  // Check if we can scroll
  useEffect(() => {
    if (!scrollRef.current) return
    
    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
    
    const element = scrollRef.current
    element.addEventListener('scroll', checkScroll)
    
    // Initial check
    checkScroll()
    
    return () => element.removeEventListener('scroll', checkScroll)
  }, [forecast])
  
  const scroll = (direction) => {
    if (!scrollRef.current) return
    
    const { clientWidth } = scrollRef.current
    const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2
    
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }
  
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return null
  }
  
  // Only show the next 24 hours (8 items)
  const hourlyData = forecast.list.slice(0, 8)
  
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    }
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white shaded-text">Hourly Forecast</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-1 rounded-full glass ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-1 rounded-full glass ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 space-x-3"
        >
          {hourlyData.map((hour, index) => {
            const time = new Date(hour.dt * 1000)
            const isNow = index === 0
            const hourText = isNow
              ? 'Now'
              : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
            
            return (
              <div 
                key={hour.dt}
                className={`flex-shrink-0 glass rounded-xl p-4 w-24 text-center
                  ${isNow ? 'bg-white/20 ring-1 ring-white/50' : ''}`}
              >
                <p className="text-white font-medium text-sm mb-2">{hourText}</p>
                <WeatherIcon 
                  weatherId={hour.weather[0].id} 
                  isDay={true} 
                  size="small"
                />
                <p className="mt-2 text-white font-semibold">
                  {formatTemperature(hour.main.temp, units)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default HourlyForecast