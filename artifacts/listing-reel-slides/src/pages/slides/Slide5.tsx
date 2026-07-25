export default function Slide5() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0B1628' }}
    >
      {/* Radial glow — bottom-right warmth */}
      <div
        className="absolute bottom-0 right-0 w-[55vw] h-[55vh]"
        style={{
          background:
            'radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.13) 0%, transparent 65%)',
        }}
      />

      {/* Top-left accent */}
      <div
        className="absolute top-0 left-0 w-[30vw] h-[30vh]"
        style={{
          background:
            'radial-gradient(ellipse at 0% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Content — centered */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-[12vw]">

        {/* Gold bar */}
        <div
          className="w-[4vw] h-[0.35vh] mb-[4.5vh]"
          style={{ backgroundColor: '#C9A84C' }}
        />

        {/* Headline */}
        <h2
          className="font-display font-bold text-[4.5vw] leading-tight tracking-tight text-white mb-[3.5vh]"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Ready to make your listing stand out?
        </h2>

        {/* Para 1 */}
        <p
          className="font-body text-[2.1vw] leading-relaxed mb-[2.5vh]"
          style={{ color: 'rgba(255,255,255,0.68)', maxWidth: '58vw' }}
        >
          Open ListingReel in any browser — no install, no account, no property photos leave your device.
        </p>

        {/* Para 2 */}
        <p
          className="font-body text-[2.1vw] leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.50)', maxWidth: '52vw' }}
        >
          Your project details are saved locally so you can pick up right where you left off.
        </p>

        {/* Wordmark lockup */}
        <div className="flex items-center gap-[2.5vw] mt-[5.5vh]">
          <div
            className="h-px"
            style={{ width: '7vw', backgroundColor: 'rgba(201,168,76,0.38)' }}
          />
          <p
            className="font-body text-[1.6vw] tracking-[0.28em] uppercase font-semibold"
            style={{ color: '#C9A84C' }}
          >
            ListingReel
          </p>
          <div
            className="h-px"
            style={{ width: '7vw', backgroundColor: 'rgba(201,168,76,0.38)' }}
          />
        </div>

      </div>
    </div>
  );
}
