import { useEffect, useRef } from 'react'

const RainAnimation = () => {
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const containerWidth = window.innerWidth
    
    // Create rain drops
    const createRain = () => {
      // Clear existing raindrops
      container.innerHTML = ''
      
      // Create new raindrops
      const dropCount = Math.floor(containerWidth / 10) // One drop every 10px approximately
      
      for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div')
        drop.classList.add('rain-drop')
        
        // Random positioning
        drop.style.left = `${Math.random() * 100}%`
        
        // Random delays for more natural effect
        drop.style.animationDelay = `${Math.random() * 2}s`
        
        // Random animation duration between 0.7 and 1.5 seconds
        drop.style.animationDuration = `${0.7 + Math.random()}s`
        
        // Random height between 10px and 20px for more variation
        drop.style.height = `${10 + Math.random() * 10}px`
        
        // Random opacity
        drop.style.opacity = `${0.5 + Math.random() * 0.5}`
        
        container.appendChild(drop)
      }
    }
    
    // Create initial rain
    createRain()
    
    // Re-create rain on window resize
    const handleResize = () => {
      createRain()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
}

export default RainAnimation