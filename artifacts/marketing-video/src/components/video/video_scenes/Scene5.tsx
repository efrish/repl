import { motion } from 'framer-motion';

export const Scene5 = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-between overflow-hidden bg-[#1c1c1e] px-[10vw]"
      initial={{ opacity: 0, x: '-100vw' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-1/2 flex flex-col justify-center">
        <motion.h2
          className="font-display text-[10vw] leading-[0.9] text-[#f5f2ec] uppercase m-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Your Branding
        </motion.h2>
        <motion.h2
          className="font-display text-[10vw] leading-[0.9] text-[#b89a5a] uppercase m-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Built-in.
        </motion.h2>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-[10vw] h-[4px] bg-[#4a4a4f] mt-[4vh]"
        />
        
        <motion.p
          className="font-body text-[3vw] text-[#e6e3dd] mt-[4vh] tracking-widest uppercase font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          Century 21 Hollywood
        </motion.p>
      </div>

      <div className="w-1/2 flex justify-center items-center">
        <motion.div
          className="w-[30vw] bg-[#f5f2ec] rounded-2xl p-[2vw] shadow-2xl relative"
          initial={{ y: '50vh', opacity: 0, rotateZ: 10 }}
          animate={{ y: 0, opacity: 1, rotateZ: -5 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="flex items-center gap-[1.5vw] mb-[2vh]">
            <img 
              src={`${import.meta.env.BASE_URL}images/agent.jpg`}
              alt="Agent"
              className="w-[6vw] h-[6vw] rounded-full object-cover border-2 border-[#b89a5a]"
            />
            <div>
              <div className="font-display text-[2.5vw] text-[#1c1c1e] leading-none uppercase">Edward Frish</div>
              <div className="font-body text-[1.2vw] text-[#4a4a4f] uppercase tracking-wider mt-[0.5vh]">Real Estate Agent</div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#1c1c1e] opacity-10 mb-[2vh]" />
          <div className="font-display text-[1.8vw] text-[#b89a5a] text-center uppercase tracking-widest">
            Century 21 Hollywood
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
