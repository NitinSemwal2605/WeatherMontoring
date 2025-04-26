import { motion } from 'framer-motion'

const CloudsAnimation = () => {
  const clouds = [
    { id: 1, x: '-5%', y: '10%', delay: 0, duration: 160, size: 'w-48 h-24' },
    { id: 2, x: '15%', y: '25%', delay: 5, duration: 140, size: 'w-64 h-32' },
    { id: 3, x: '30%', y: '15%', delay: 10, duration: 190, size: 'w-56 h-28' },
    { id: 4, x: '70%', y: '20%', delay: 15, duration: 150, size: 'w-52 h-26' },
    { id: 5, x: '85%', y: '10%', delay: 20, duration: 170, size: 'w-60 h-30' },
  ]
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className={`absolute ${cloud.size} bg-white/20 rounded-full blur-md`}
          style={{
            left: cloud.x,
            top: cloud.y,
          }}
          initial={{ x: '-100vw' }}
          animate={{ 
            x: '100vw',
          }}
          transition={{
            repeat: Infinity,
            duration: cloud.duration,
            delay: cloud.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export default CloudsAnimation