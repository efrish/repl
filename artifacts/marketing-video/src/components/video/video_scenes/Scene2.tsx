import { motion } from 'framer-motion';

export const Scene2 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#f5f2ec]"
      initial={{ opacity: 0, x: '100vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-20 flex flex-col items-center">
        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 14 }}
          className="w-[15vw] h-[15vw] rounded-[3vw] flex items-center justify-center shadow-2xl mb-[6vh] overflow-hidden"
        >
          <img 
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Text */}
        <div className="overflow-hidden">
          <motion.div
            className="font-body text-[3vw] text-[#4a4a4f] uppercase tracking-[0.5em] mb-[2vh] text-center"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Introducing
          </motion.div>
        </div>
        
        <div className="overflow-hidden">
          <motion.div
            className="font-display text-[15vw] leading-[0.8] text-[#1c1c1e] m-0"
            initial={{ y: '100%', rotateX: 45, opacity: 0 }}
            animate={{ y: '0%', rotateX: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            ListingReel
          </motion.div>
        </div>
      </div>
      
      {/* Decorative accent lines */}
      <motion.div 
        className="absolute top-0 left-[10vw] w-[1px] h-full bg-[#1c1c1e] opacity-10"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.5, duration: 1, ease: "circOut" }}
      />
      <motion.div 
        className="absolute top-0 right-[10vw] w-[1px] h-full bg-[#1c1c1e] opacity-10"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.6, duration: 1, ease: "circOut" }}
      />
    </motion.div>
  );
};
