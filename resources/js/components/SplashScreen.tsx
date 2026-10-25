import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // ponytail: no splash for reduced-motion users, no animation to skip
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      localStorage.setItem('ctu-splash-seen', '1')
      return
    }
    const hasVisited = localStorage.getItem('ctu-splash-seen')
    if (!hasVisited) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        localStorage.setItem('ctu-splash-seen', '1')
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-primary flex items-center justify-center"
        >
          <div className="text-center">
            {/* Infinite Grid Animation */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white/20 rounded-lg"
                  style={{
                    width: 28,
                    height: 28,
                    left: (i % 3) * 32,
                    top: Math.floor(i / 3) * 32,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Logo Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.25 }}
              className="text-4xl font-bold text-white mb-2"
            >
              CTU
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
              className="text-white text-lg"
            >
              Kecamatan Tarakan Utara
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
