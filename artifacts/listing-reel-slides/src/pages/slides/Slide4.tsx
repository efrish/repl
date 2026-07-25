export default function Slide4() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0B1628' }}
    >
      {/* Subtle gold grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px)',
          backgroundSize: '9vw 9vw',
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[50vh]"
        style={{
          background:
            'radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.14) 0%, transparent 65%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-[8vw] py-[5vh]">

        {/* Kicker */}
        <p
          className="font-body text-[1.5vw] tracking-[0.32em] uppercase mb-[2vh] font-semibold"
          style={{ color: '#C9A84C' }}
        >
          Multi-Platform
        </p>

        {/* Headline */}
        <h2
          className="font-display font-bold text-[4vw] leading-tight tracking-tight text-white mb-[4vh]"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Every format. Every platform.
        </h2>

        {/* Three format cards */}
        <div className="flex gap-[2.2vw] mb-[3.5vh]">

          {/* Vertical */}
          <div
            className="flex-1 px-[2.5vw] py-[2.8vh] rounded-[0.8vw]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(201,168,76,0.22)',
            }}
          >
            <p
              className="font-body text-[1.4vw] tracking-[0.22em] uppercase mb-[1.5vh] font-semibold"
              style={{ color: '#C9A84C' }}
            >
              Vertical
            </p>
            <p className="font-display font-bold text-[2.4vw] text-white mb-[1vh]">
              1080 × 1920
            </p>
            <p
              className="font-body text-[1.7vw]"
              style={{ color: 'rgba(255,255,255,0.52)' }}
            >
              Reels · TikTok · Shorts
            </p>
          </div>

          {/* Square — highlighted */}
          <div
            className="flex-1 px-[2.5vw] py-[2.8vh] rounded-[0.8vw]"
            style={{
              backgroundColor: 'rgba(201,168,76,0.11)',
              border: '1px solid rgba(201,168,76,0.45)',
            }}
          >
            <p
              className="font-body text-[1.4vw] tracking-[0.22em] uppercase mb-[1.5vh] font-semibold"
              style={{ color: '#C9A84C' }}
            >
              Square
            </p>
            <p className="font-display font-bold text-[2.4vw] text-white mb-[1vh]">
              1080 × 1080
            </p>
            <p
              className="font-body text-[1.7vw]"
              style={{ color: 'rgba(255,255,255,0.52)' }}
            >
              Instagram · Facebook
            </p>
          </div>

          {/* Landscape */}
          <div
            className="flex-1 px-[2.5vw] py-[2.8vh] rounded-[0.8vw]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(201,168,76,0.22)',
            }}
          >
            <p
              className="font-body text-[1.4vw] tracking-[0.22em] uppercase mb-[1.5vh] font-semibold"
              style={{ color: '#C9A84C' }}
            >
              Landscape
            </p>
            <p className="font-display font-bold text-[2.4vw] text-white mb-[1vh]">
              1920 × 1080
            </p>
            <p
              className="font-body text-[1.7vw]"
              style={{ color: 'rgba(255,255,255,0.52)' }}
            >
              YouTube · Website
            </p>
          </div>

        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-[3vh]"
          style={{ backgroundColor: 'rgba(201,168,76,0.18)' }}
        />

        {/* Bottom two items */}
        <div className="flex gap-[5vw]">

          <div className="flex items-start gap-[1.5vw]">
            <span
              className="flex-shrink-0 w-[0.45vw] h-[0.45vw] rounded-full"
              style={{ backgroundColor: '#C9A84C', marginTop: '1.1vh' }}
            />
            <p
              className="font-body text-[1.9vw]"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              Branded social version with music support
            </p>
          </div>

          <div className="flex items-start gap-[1.5vw]">
            <span
              className="flex-shrink-0 w-[0.45vw] h-[0.45vw] rounded-full"
              style={{ backgroundColor: '#C9A84C', marginTop: '1.1vh' }}
            />
            <p
              className="font-body text-[1.9vw]"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              MLS-safe version: no agent branding, no marketing copy, no music
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
