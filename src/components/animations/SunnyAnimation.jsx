import { motion } from 'framer-motion'

const SunnyAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        className="absolute w-56 h-56 rounded-full bg-yellow-400/30 blur-2xl"
        style={{ top: '10%', right: '15%' }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.5, 0.4]
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }}
      />
      
      {/* Sun rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 bg-yellow-400/20"
          style={{
            height: '40vh',
            top: '10%',
            right: '15%',
            transformOrigin: 'bottom',
            rotate: i * 45,
          }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            height: ['30vh', '35vh', '30vh']
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default SunnyAnimation