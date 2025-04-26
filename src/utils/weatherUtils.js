/**
 * Format temperature with units
 * @param {number} temp - Temperature value
 * @param {string} units - Units (metric, imperial)
 * @returns {string} - Formatted temperature
 */
export const formatTemperature = (temp, units = 'metric') => {
  const unit = units === 'imperial' ? '°F' : '°C'
  return `${Math.round(temp)}${unit}`
}

/**
 * Format wind speed with units
 * @param {number} speed - Wind speed value
 * @param {string} units - Units (metric, imperial)
 * @returns {string} - Formatted wind speed
 */
export const formatWindSpeed = (speed, units = 'metric') => {
  const unit = units === 'imperial' ? 'mph' : 'm/s'
  return `${speed} ${unit}`
}

/**
 * Convert UNIX timestamp to formatted time string
 * @param {number} timestamp - UNIX timestamp in seconds
 * @returns {string} - Formatted time string (HH:MM AM/PM)
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

/**
 * Format date from UNIX timestamp
 * @param {number} timestamp - UNIX timestamp in seconds
 * @returns {string} - Formatted date string (Day, Month Date)
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Get appropriate weather icon based on weather ID and day/night
 * @param {number} weatherId - Weather condition ID from OpenWeather API
 * @param {boolean} isDay - Whether it's day or night
 * @returns {string} - Icon name
 */
export const getWeatherIcon = (weatherId, isDay = true) => {
  const time = isDay ? 'day' : 'night'
  
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return 'thunderstorm'
  }
  
  // Drizzle & Rain
  if (weatherId >= 300 && weatherId < 600) {
    if (weatherId >= 502) {
      return 'heavy-rain'
    }
    return 'rain'
  }
  
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return 'snow'
  }
  
  // Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId < 800) {
    return 'fog'
  }
  
  // Clear
  if (weatherId === 800) {
    return isDay ? 'clear-day' : 'clear-night'
  }
  
  // Clouds
  if (weatherId > 800) {
    if (weatherId === 801) {
      return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night'
    }
    return 'cloudy'
  }
  
  return isDay ? 'clear-day' : 'clear-night'
}

/**
 * Get human-readable description of weather condition
 * @param {object} weather - Weather object from API
 * @param {number} temp - Temperature value
 * @returns {string} - Weather description
 */
export const getWeatherDescription = (weather, temp) => {
  if (!weather) return ''
  
  const weatherId = weather.id
  const description = weather.description
  const capitalizedDesc = description.charAt(0).toUpperCase() + description.slice(1)
  
  // Add temperature context
  let tempContext = ''
  if (temp < 0) {
    tempContext = 'Freezing'
  } else if (temp < 10) {
    tempContext = 'Very cold'
  } else if (temp < 20) {
    tempContext = 'Cool'
  } else if (temp < 30) {
    tempContext = 'Warm'
  } else {
    tempContext = 'Hot'
  }
  
  return `${capitalizedDesc}. ${tempContext} conditions.`
}

/**
 * Group forecast data by day
 * @param {Array} forecastList - List of forecast items
 * @returns {Object} - Forecast grouped by day
 */
export const groupForecastByDay = (forecastList) => {
  const grouped = {}
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const day = date.toDateString()
    
    if (!grouped[day]) {
      grouped[day] = []
    }
    
    grouped[day].push(item)
  })
  
  return grouped
}

/**
 * Get daily summary from 3-hour forecast data
 * @param {Array} dayForecasts - List of forecasts for a single day
 * @returns {Object} - Daily summary
 */
export const getDailySummary = (dayForecasts) => {
  // Find min and max temperatures for the day
  const temps = dayForecasts.map(f => f.main.temp)
  const maxTemp = Math.max(...temps)
  const minTemp = Math.min(...temps)
  
  // Get the most common weather condition
  const weatherCounts = {}
  dayForecasts.forEach(f => {
    const weatherId = f.weather[0].id
    weatherCounts[weatherId] = (weatherCounts[weatherId] || 0) + 1
  })
  
  const mostCommonWeatherId = Object.entries(weatherCounts)
    .sort((a, b) => b[1] - a[1])[0][0]
  
  // Find a forecast with that weather ID
  const representativeForecast = dayForecasts.find(
    f => f.weather[0].id.toString() === mostCommonWeatherId
  )
  
  // Use the noon forecast as representative
  const noonForecast = dayForecasts.find(f => {
    const hour = new Date(f.dt * 1000).getHours()
    return hour >= 11 && hour <= 13
  }) || dayForecasts[Math.floor(dayForecasts.length / 2)]
  
  return {
    date: noonForecast.dt,
    maxTemp,
    minTemp,
    weather: representativeForecast.weather[0],
    humidity: noonForecast.main.humidity,
    windSpeed: noonForecast.wind.speed,
    icon: getWeatherIcon(parseInt(mostCommonWeatherId), true)
  }
}

/**
 * Calculate feels like description
 * @param {number} temp - Temperature value
 * @param {number} feelsLike - Feels like temperature
 * @returns {string} - Description of how it feels
 */
export const getFeelsLikeDescription = (temp, feelsLike) => {
  const diff = feelsLike - temp
  
  if (diff > 3) return 'Feels warmer due to humidity'
  if (diff < -3) return 'Feels colder due to wind'
  return 'Feels like actual temperature'
}