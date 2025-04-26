import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import SearchBar from './SearchBar'
import { WiDaySunny } from 'react-icons/wi'

const Header = () => {
  const location = useLocation()
  const { currentWeather } = useWeather()
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Add scroll listener to change header appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const headerVariants = {
    initial: { 
      opacity: 0,
      y: -20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  }
  
  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`sticky top-0 z-50 transition-all duration-300 
        ${isScrolled ? 'dark-glass py-2' : 'py-4'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              aria-label="MausamWiki - Homepage"
            >
              <WiDaySunny className="text-white text-3xl logo" />
              <h1 className="text-white text-xl md:text-2xl font-bold shaded-text">
                MausamWiki
              </h1>
            </Link>
            
            {currentWeather && (
              <div className="ml-6 hidden md:flex items-center">
                <p className="text-white/90 font-medium">
                  {currentWeather.name}, {currentWeather.sys.country}
                </p>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-auto">
            <SearchBar />
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className={`text-white font-medium transition-all hover:text-white 
                    ${location.pathname === '/' ? 'border-b-2 border-white' : 'text-white/80'}`}
                >
                  Today
                </Link>
              </li>
              <li>
                <Link 
                  to="/forecast" 
                  className={`text-white font-medium transition-all hover:text-white 
                    ${location.pathname === '/forecast' ? 'border-b-2 border-white' : 'text-white/80'}`}
                >
                  Forecast
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        <nav className="md:hidden mt-3 mb-1">
          <ul className="flex justify-center space-x-12">
            <li>
              <Link 
                to="/" 
                className={`text-white font-medium transition-all hover:text-white 
                  ${location.pathname === '/' ? 'border-b-2 border-white' : 'text-white/80'}`}
              >
                Today
              </Link>
            </li>
            <li>
              <Link 
                to="/forecast" 
                className={`text-white font-medium transition-all hover:text-white 
                  ${location.pathname === '/forecast' ? 'border-b-2 border-white' : 'text-white/80'}`}
              >
                Forecast
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  )
}

export default Header