import { motion } from 'framer-motion';

export const Scene3 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#1c1c1e]"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[5vw]">
        
        {/* Photo Grid */}
        <div className="flex gap-[2vw] mb-[8vh]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-[12vw] h-[16vw] bg-[#4a4a4f] rounded-lg overflow-hidden relative shadow-lg"
              initial={{ opacity: 0, y: 50, rotateZ: i % 2 === 0 ? -10 : 10 }}
              animate={{ opacity: 1, y: 0, rotateZ: 0 }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.img
                src={`${import.meta.env.BASE_URL}images/house${(i % 3) + 1}.jpg`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
              />
              <motion.div 
                className="absolute inset-0 bg-[#b89a5a]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Text */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            className="overflow-hidden"
          >
            <motion.h2
              className="font-display text-[8vw] leading-none text-[#f5f2ec] uppercase mb-[2vh]"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 2.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Drop 6 photos in
            </motion.h2>
          </motion.div>
          <motion.div
            className="overflow-hidden"
          >
            <motion.h2
              className="font-display text-[8vw] leading-none text-[#b89a5a] uppercase"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 2.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Get reels out
            </motion.h2>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
