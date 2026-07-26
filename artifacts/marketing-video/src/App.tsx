import { SignUpButton, SignInButton, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

import VideoTemplate from '@/components/video/VideoTemplate';

export default function App() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoTemplate />

      {/* CTA overlay — fades in after first scene, hidden once signed in */}
      {!isSignedIn && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[60] flex flex-col items-center gap-[1.8vh] pb-[5vh] pt-[12vh]"
          style={{
            background:
              'linear-gradient(to top, rgba(28,28,30,0.97) 55%, transparent)',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            style={{ fontFamily: 'var(--font-body)' }}
            className="text-[#b89a5a] tracking-[0.25em] uppercase text-[1.1vw] font-light m-0"
          >
            Ready to create listing videos in seconds?
          </p>

          <div className="flex items-center gap-[2vw]">
            <SignUpButton mode="modal" forceRedirectUrl="/">
              <button
                style={{ fontFamily: 'var(--font-display)' }}
                className="
                  relative px-[3vw] py-[1.2vh]
                  bg-[#b89a5a] text-[#1c1c1e]
                  text-[1.3vw] tracking-[0.15em] uppercase
                  rounded-none border-0 cursor-pointer
                  transition-all duration-300
                  hover:bg-[#dfc68b] hover:scale-105
                  active:scale-95
                "
              >
                Request Access
              </button>
            </SignUpButton>

            <SignInButton mode="modal" forceRedirectUrl="/">
              <button
                style={{ fontFamily: 'var(--font-body)' }}
                className="
                  px-[2vw] py-[1.2vh]
                  bg-transparent text-[#f5f2ec]
                  text-[1vw] tracking-[0.15em] uppercase font-light
                  border border-[rgba(245,242,236,0.25)] cursor-pointer
                  transition-all duration-300
                  hover:border-[rgba(245,242,236,0.6)] hover:text-[#f5f2ec]
                  active:scale-95
                "
              >
                Already an agent? Sign In
              </button>
            </SignInButton>
          </div>
        </motion.div>
      )}

      {/* Signed-in state — redirect nudge */}
      {isSignedIn && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[60] flex flex-col items-center gap-[1.5vh] pb-[5vh] pt-[12vh]"
          style={{
            background:
              'linear-gradient(to top, rgba(28,28,30,0.97) 55%, transparent)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p
            style={{ fontFamily: 'var(--font-body)' }}
            className="text-[#b89a5a] tracking-[0.2em] uppercase text-[1vw] font-light m-0"
          >
            You're in. Head to the studio.
          </p>
          <a
            href="/"
            style={{ fontFamily: 'var(--font-display)' }}
            className="
              px-[3vw] py-[1.2vh]
              bg-[#b89a5a] text-[#1c1c1e]
              text-[1.3vw] tracking-[0.15em] uppercase no-underline
              transition-all duration-300
              hover:bg-[#dfc68b] hover:scale-105
            "
          >
            Open ListingReel →
          </a>
        </motion.div>
      )}
    </div>
  );
}
