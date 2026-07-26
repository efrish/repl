import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';

import { Scene0 } from './video_scenes/Scene0';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';

const SCENE_DURATIONS = {
  0: 4500, // Hook
  1: 4000, // Problem
  2: 4000, // Solution (Logo)
  3: 4500, // How it works
  4: 4500, // Private/Browser
  5: 4500, // Branded Century 21
  6: 6000, // Outputs/Mockups
  7: 6000, // Closer
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: 'var(--color-bg-dark)' }}
    >
      <div className="noise-overlay" />
      
      {/* Persistent Background Element */}
      <motion.div 
        className="absolute rounded-full pointer-events-none mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(184, 154, 90, 0.4) 0%, rgba(28, 28, 30, 0) 70%)' }}
        animate={{
          width: currentScene === 0 ? '120vw' : currentScene === 2 ? '150vw' : currentScene === 7 ? '180vw' : '80vw',
          height: currentScene === 0 ? '120vw' : currentScene === 2 ? '150vw' : currentScene === 7 ? '180vw' : '80vw',
          x: currentScene === 0 ? '-30vw' : currentScene === 3 ? '40vw' : currentScene === 5 ? '-20vw' : '10vw',
          y: currentScene === 0 ? '-20vh' : currentScene === 4 ? '50vh' : currentScene === 6 ? '-30vh' : '10vh',
          opacity: [2, 4, 6].includes(currentScene) ? 0.2 : 0.6,
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene0 key="scene0" />}
        {currentScene === 1 && <Scene1 key="scene1" />}
        {currentScene === 2 && <Scene2 key="scene2" />}
        {currentScene === 3 && <Scene3 key="scene3" />}
        {currentScene === 4 && <Scene4 key="scene4" />}
        {currentScene === 5 && <Scene5 key="scene5" />}
        {currentScene === 6 && <Scene6 key="scene6" />}
        {currentScene === 7 && <Scene7 key="scene7" />}
      </AnimatePresence>
    </div>
  );
}
