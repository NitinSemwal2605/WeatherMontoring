import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useWeather } from '../context/WeatherContext'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const WeatherChart = () => {
  const { forecast, units } = useWeather()
  
  useEffect(() => {
    // Update chart on units change
    ChartJS.defaults.color = 'rgba(255, 255, 255, 0.8)'
    ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)'
  }, [])
  
  if (!forecast || !forecast.list) return null
  
  // Prepare data for the next 24 hours (8 data points)
  const next24Hours = forecast.list.slice(0, 8)
  
  const data = {
    labels: next24Hours.map(item => {
      const time = new Date(item.dt * 1000)
      return time.getHours().toString().padStart(2, '0') + ':00'
    }),
    datasets: [
      {
        label: 'Temperature',
        data: next24Hours.map(item => item.main.temp),
        borderColor: 'rgba(255, 159, 64, 0.8)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Feels Like',
        data: next24Hours.map(item => item.main.feels_like),
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + '°' + (units === 'metric' ? 'C' : 'F')
            }
            return label
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return value + '°' + (units === 'metric' ? 'C' : 'F')
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-white shaded-text mb-4">Temperature Trend</h2>
      
      <div className="glass rounded-xl p-6">
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherChart