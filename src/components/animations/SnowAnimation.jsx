import { useEffect, useRef } from 'react'

const SnowAnimation = () => {
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const containerWidth = window.innerWidth
    
    // Create snow flakes
    const createSnow = () => {
      // Clear existing snowflakes
      container.innerHTML = ''
      
      // Create new snowflakes
      const flakeCount = Math.floor(containerWidth / 30) // One flake every 30px approximately
      
      for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div')
        flake.classList.add('snow-flake')
        
        // Random positioning
        flake.style.left = `${Math.random() * 100}%`
        
        // Random delays for more natural effect
        flake.style.animationDelay = `${Math.random() * 5}s`
        
        // Random animation duration
        flake.style.animationDuration = `${3 + Math.random() * 7}s`
        
        // Random size
        const size = 2 + Math.random() * 6
        flake.style.width = `${size}px`
        flake.style.height = `${size}px`
        
        // Random opacity
        flake.style.opacity = `${0.6 + Math.random() * 0.4}`
        
        container.appendChild(flake)
      }
    }
    
    // Create initial snow
    createSnow()
    
    // Re-create snow on window resize
    const handleResize = () => {
      createSnow()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
}

export default SnowAnimation