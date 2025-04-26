import { useState, useEffect, useRef } from 'react'
import { useWeather } from '../context/WeatherContext'
import { FiSearch, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = () => {
  const { searchCity, recentSearches, error } = useWeather()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  
  // Handle clicks outside search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      searchCity(query)
      setShowSuggestions(false)
      setQuery('')
    }
  }
  
  const handleSuggestionClick = (city) => {
    searchCity(city)
    setShowSuggestions(false)
    setQuery('')
  }
  
  const clearSearch = () => {
    setQuery('')
  }
  
  return (
    <div
      ref={searchRef}
      className="relative search-container"
    >
      <form onSubmit={handleSearch} className="relative">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`relative flex items-center glass rounded-full px-4 py-2 
            transition-all duration-300 ${isFocused ? 'ring-2 ring-white/30' : ''}`}
        >
          <FiSearch className="text-white/90 mr-2" />
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              setShowSuggestions(true)
            }}
            className="bg-transparent border-none outline-none text-white w-full placeholder-white/70"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </motion.div>
      </form>
      
      {/* Display error message if present */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute w-full mt-2 px-4 py-2 glass rounded-xl text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <AnimatePresence>
        {showSuggestions && recentSearches.length > 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full glass rounded-xl overflow-hidden z-50"
          >
            <h3 className="px-4 py-2 text-white/80 text-sm font-medium border-b border-white/10">
              Recent Searches
            </h3>
            <ul>
              {recentSearches.map((city, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSuggestionClick(city)}
                    className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center">
                      <FiSearch className="text-white/70 mr-2" />
                      <span>{city}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar