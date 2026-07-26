import { motion } from 'framer-motion';

export const Scene4 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#b89a5a]"
      initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: '100vw' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: "1000px" }}
    >
      <div className="relative z-20 flex flex-col items-center w-full px-[10vw] text-center">
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 150, damping: 15 }}
          className="mb-[4vh]"
        >
          <svg width="15vw" height="15vw" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </motion.div>

        <motion.h2
          className="font-display text-[12vw] leading-none text-[#1c1c1e] uppercase m-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          100% Private
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-[20vw] h-[4px] bg-[#1c1c1e] my-[4vh]"
        />

        <motion.p
          className="font-body text-[3.5vw] text-[#4a4a4f] uppercase tracking-wider font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          Generated entirely in your browser.
        </motion.p>
        <motion.p
          className="font-body text-[2.5vw] text-[#1c1c1e] mt-[1vh] tracking-widest uppercase opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          No server uploads.
        </motion.p>
      </div>

    </motion.div>
  );
};
