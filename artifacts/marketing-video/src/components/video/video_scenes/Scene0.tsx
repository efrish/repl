import { motion } from 'framer-motion';

export const Scene0 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Video */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4.5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-[#1c1c1e] opacity-80 z-10 mix-blend-multiply" />
        <video
          src={`${import.meta.env.BASE_URL}videos/agent-bg.mp4`}
          className="w-full h-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
        />
      </motion.div>

      {/* Typography */}
      <div className="relative z-20 flex flex-col items-center text-center w-full px-[10vw]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[2vh]"
        >
          <span className="font-body text-[3vw] text-[#f5f2ec] tracking-widest uppercase font-medium">
            You're a real estate agent.
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[12vw] leading-[0.85] text-[#b89a5a] m-0 uppercase"
            initial={{ y: '100%', rotateX: 45, opacity: 0 }}
            animate={{ y: '0%', rotateX: 0, opacity: 1 }}
            transition={{
              delay: 1.6,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Not a video
          </motion.h1>
        </div>
        <div className="overflow-hidden mt-[1vh]">
          <motion.h1
            className="font-display text-[12vw] leading-[0.85] text-[#f5f2ec] m-0 uppercase"
            initial={{ y: '100%', rotateX: 45, opacity: 0 }}
            animate={{ y: '0%', rotateX: 0, opacity: 1 }}
            transition={{
              delay: 1.8,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Editor.
          </motion.h1>
        </div>
      </div>
      
      {/* Scanning line effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[2px] bg-[#b89a5a] z-30 opacity-50 shadow-[0_0_15px_#b89a5a]"
        initial={{ y: 0 }}
        animate={{ y: '100vh' }}
        transition={{ delay: 1.6, duration: 2, ease: "linear" }}
      />
    </motion.div>
  );
};
