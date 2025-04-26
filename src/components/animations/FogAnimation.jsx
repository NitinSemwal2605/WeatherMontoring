import { motion } from 'framer-motion'

const FogAnimation = () => {
  const fogLayers = [
    { y: '20%', opacity: 0.4, scale: 1.7, duration: 80 },
    { y: '40%', opacity: 0.3, scale: 1.5, duration: 100 },
    { y: '60%', opacity: 0.2, scale: 1.3, duration: 120 },
    { y: '80%', opacity: 0.1, scale: 1.1, duration: 140 },
  ]
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {fogLayers.map((fog, index) => (
        <motion.div
          key={index}
          className="absolute inset-x-0 h-24 bg-white blur-2xl"
          style={{
            top: fog.y,
            opacity: fog.opacity,
            scale: fog.scale,
          }}
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: fog.duration,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export default FogAnimation