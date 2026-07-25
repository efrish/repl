const base = import.meta.env.BASE_URL;

export default function Slide1() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0B1628' }}
    >
      {/* Hero image */}
      <img
        src={`${base}hero.jpg`}
        crossOrigin="anonymous"
        alt="Luxury property exterior"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Directional overlay — dark left, fades right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(11,22,40,0.96) 0%, rgba(11,22,40,0.80) 50%, rgba(11,22,40,0.30) 100%)',
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(11,22,40,0.55) 0%, transparent 40%)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-[8vw]">
        {/* Gold accent bar */}
        <div
          className="w-[5vw] h-[0.35vh] mb-[3vh]"
          style={{ backgroundColor: '#C9A84C' }}
        />

        {/* Eyebrow */}
        <p
          className="font-body text-[1.4vw] tracking-[0.35em] uppercase mb-[1.8vh] font-semibold"
          style={{ color: '#C9A84C' }}
        >
          Property Video Studio
        </p>

        {/* Main title */}
        <h1
          className="font-display font-bold text-white leading-none tracking-tight text-[7vw]"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          ListingReel
        </h1>

        {/* Subtitle */}
        <p
          className="font-body text-[2.1vw] mt-[2.5vh] leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.70)', maxWidth: '42vw' }}
        >
          The fastest way to turn MLS photos into scroll-stopping property videos.
        </p>

        {/* Tag strip */}
        <div className="flex items-center gap-[2.5vw] mt-[4.5vh]">
          <span
            className="font-body text-[1.5vw] tracking-wide"
            style={{ color: 'rgba(255,255,255,0.42)' }}
          >
            No uploads to third parties
          </span>
          <span
            className="w-[0.3vw] h-[0.3vw] rounded-full flex-shrink-0"
            style={{ backgroundColor: '#C9A84C' }}
          />
          <span
            className="font-body text-[1.5vw] tracking-wide"
            style={{ color: 'rgba(255,255,255,0.42)' }}
          >
            In-browser rendering
          </span>
          <span
            className="w-[0.3vw] h-[0.3vw] rounded-full flex-shrink-0"
            style={{ backgroundColor: '#C9A84C' }}
          />
          <span
            className="font-body text-[1.5vw] tracking-wide"
            style={{ color: 'rgba(255,255,255,0.42)' }}
          >
            Device-local saving
          </span>
        </div>
      </div>
    </div>
  );
}
