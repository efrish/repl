import { motion } from 'framer-motion';

export const Scene6 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#e6e3dd]"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 flex flex-col justify-center overflow-hidden">
        
        {/* Background scrolling text */}
        <motion.div
          className="absolute top-[10vh] whitespace-nowrap font-display text-[15vw] text-[#1c1c1e] opacity-5 uppercase"
          initial={{ x: '10vw' }}
          animate={{ x: '-100vw' }}
          transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
        >
          INSTAGRAM REELS TIKTOK YOUTUBE SHORTS FACEBOOK
        </motion.div>
        <motion.div
          className="absolute bottom-[10vh] whitespace-nowrap font-display text-[15vw] text-[#1c1c1e] opacity-5 uppercase"
          initial={{ x: '-50vw' }}
          animate={{ x: '50vw' }}
          transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
        >
          LINKEDIN INSTAGRAM REELS TIKTOK YOUTUBE SHORTS
        </motion.div>

        {/* Phones Container */}
        <div className="flex gap-[4vw] justify-center items-center relative z-20">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-[18vw] h-[32vw] bg-[#1c1c1e] rounded-[2vw] p-[0.5vw] shadow-2xl relative"
              initial={{ y: '50vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 100, damping: 15 }}
              style={{
                y: i === 1 ? '-5vh' : '5vh',
              }}
            >
              <div className="w-full h-full rounded-[1.5vw] overflow-hidden relative">
                <img
                  src={`${import.meta.env.BASE_URL}images/house${i + 1}.jpg`}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-[2vw] left-[2vw] right-[2vw]">
                  <div className="w-full h-[0.5vw] bg-[#f5f2ec] rounded-full opacity-50 mb-[1vw]" />
                  <div className="font-display text-[1.5vw] text-[#f5f2ec] uppercase">Just Listed</div>
                  <div className="font-body text-[1vw] text-[#b89a5a]">Century 21</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Foreground Text */}
        <motion.div
          className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] text-center z-30 pointer-events-none"
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-display text-[12vw] leading-none text-[#f5f2ec] uppercase mix-blend-difference">
            Ready for <span className="text-[#b89a5a]">Social</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
