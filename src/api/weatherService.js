import axios from 'axios'

const API_KEY = '7a64e6dc7fc252d5a7a36d4800b0ccae'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

/**
 * Get current weather data by city name
 * @param {string} city - City name
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Promise with weather data
 */
export const getCurrentWeatherByCity = async (city, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units
      }
    })
    
    // Add a day/night flag based on sunrise/sunset times
    const currentTime = Math.floor(Date.now() / 1000)
    response.data.sys.day = currentTime >= response.data.sys.sunrise && 
                            currentTime < response.data.sys.sunset
    
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data')
  }
}

/**
 * Get current weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Promise with weather data
 */
export const getCurrentWeatherByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units
      }
    })
    
    // Add a day/night flag based on sunrise/sunset times
    const currentTime = Math.floor(Date.now() / 1000)
    response.data.sys.day = currentTime >= response.data.sys.sunrise && 
                            currentTime < response.data.sys.sunset
    
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch weather data')
  }
}

/**
 * Get Air Quality Index data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} - Promise with AQI data
 */
export const getAirQuality = async (lat, lon) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch air quality data')
  }
}

/**
 * Get 5-day / 3-hour forecast data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Promise with forecast data
 */
export const getForecastByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast data')
  }
}

/**
 * Get 5-day / 3-hour forecast data by city
 * @param {string} city - City name
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Promise with forecast data
 */
export const getForecastByCity = async (city, units = 'metric') => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch forecast data')
  }
}

/**
 * Get daily forecast from One Call API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units (metric, imperial, standard)
 * @returns {Promise} - Promise with daily forecast data
 */
export const getDailyForecast = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely,alerts',
        appid: API_KEY,
        units
      }
    })
    return response.data
  } catch (error) {
    // If One Call API fails (requires subscription), fall back to 5-day forecast
    console.warn('One Call API failed, falling back to 5-day forecast', error)
    return getForecastByCoords(lat, lon, units)
  }
}