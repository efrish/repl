import { motion } from 'framer-motion';

export const Scene7 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#1c1c1e]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background Video subtle zoom */}
      <motion.div
        className="absolute inset-0 w-full h-full opacity-40"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <video
          src={`${import.meta.env.BASE_URL}videos/hero-bg.mp4`}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-[#1c1c1e] opacity-80 mix-blend-multiply" />
      </motion.div>

      <div className="relative z-20 flex flex-col items-center">
        
        <div className="flex gap-[2vw] mb-[6vh]">
          {['Your Listing.', 'Your Brand.', 'In Seconds.'].map((text, i) => (
            <motion.div
              key={i}
              className="font-display text-[4vw] text-[#e6e3dd] uppercase tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.4, duration: 0.6 }}
              style={{ color: i === 2 ? '#b89a5a' : '#e6e3dd' }}
            >
              {text}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#4a4a4f] to-transparent mb-[6vh]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1 }}
        />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2, type: 'spring', stiffness: 100, damping: 15 }}
          className="w-[12vw] h-[12vw] rounded-[2.4vw] flex items-center justify-center shadow-[0_0_50px_rgba(184,154,90,0.3)] mb-[4vh] overflow-hidden bg-[#1c1c1e]"
        >
          <img 
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>
        
        <motion.h1
          className="font-display text-[8vw] leading-none text-[#f5f2ec] uppercase tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          ListingReel
        </motion.h1>
        
      </div>
      
    </motion.div>
  );
};
