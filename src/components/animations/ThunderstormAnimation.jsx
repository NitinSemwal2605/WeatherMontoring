import { useEffect, useState } from 'react'
import RainAnimation from './RainAnimation'

const ThunderstormAnimation = () => {
  const [showLightning, setShowLightning] = useState(false)
  
  useEffect(() => {
    // Randomly trigger lightning flashes
    const lightning = () => {
      setShowLightning(true)
      
      // Lightning duration
      setTimeout(() => {
        setShowLightning(false)
        
        // Random delay until next lightning
        const nextLightning = 2000 + Math.random() * 6000
        timeoutId = setTimeout(lightning, nextLightning)
      }, 100 + Math.random() * 150)
    }
    
    // Initial delay
    let timeoutId = setTimeout(lightning, 2000)
    
    return () => clearTimeout(timeoutId)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <RainAnimation />
      
      {/* Lightning overlay */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-75 ease-in-out 
          ${showLightning ? 'opacity-30' : 'opacity-0'}`}
      />
    </div>
  )
}

export default ThunderstormAnimation