import { motion } from 'framer-motion';

export const Scene1 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#1c1c1e]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: '-100vw' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background scrolling grid of photos */}
      <div className="absolute inset-0 w-[150vw] h-[150vh] flex flex-wrap gap-4 opacity-20 rotate-[-15deg] origin-center -translate-x-[20vw] -translate-y-[20vh]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[30vw] h-[20vw] bg-[#4a4a4f] rounded-xl overflow-hidden"
            initial={{ x: 0 }}
            animate={{ x: '-50vw' }}
            transition={{
              duration: 10 + i,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/house${(i % 3) + 1}.jpg`}
              className="w-full h-full object-cover filter grayscale"
              alt=""
            />
          </motion.div>
        ))}
      </div>

      {/* Typography */}
      <div className="relative z-20 flex flex-col items-center w-full px-[10vw]">
        <motion.div
          className="font-display text-[14vw] leading-[0.85] text-center text-[#f5f2ec] uppercase flex flex-wrap justify-center gap-x-[3vw]"
        >
          {['Stop', 'Wasting', 'Hours'].map((word, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{
                delay: 0.2 + index * 0.3,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                color: index === 2 ? '#b89a5a' : '#f5f2ec',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-[80vw] h-[2px] bg-[#4a4a4f] mt-[4vh] origin-left"
        />
        
        <motion.p
          className="font-body text-[2.5vw] text-[#e6e3dd] mt-[4vh] tracking-widest uppercase font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          On manual slideshows
        </motion.p>
      </div>

    </motion.div>
  );
};
