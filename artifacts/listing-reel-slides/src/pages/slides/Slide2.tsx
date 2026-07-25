export default function Slide2() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#F5F4F0' }}
    >
      {/* Subtle warm accent in top-right */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[60vh]"
        style={{
          background:
            'radial-gradient(ellipse at 100% 0%, rgba(201,168,76,0.10) 0%, transparent 65%)',
        }}
      />

      {/* Vertical gold rule on left edge */}
      <div
        className="absolute left-0 top-[15vh] h-[70vh] w-[0.45vw]"
        style={{ backgroundColor: '#C9A84C' }}
      />

      {/* Content — centered vertically */}
      <div className="absolute inset-0 flex flex-col justify-center px-[10vw]">
        {/* Kicker */}
        <p
          className="font-body text-[1.5vw] tracking-[0.32em] uppercase mb-[2vh] font-semibold"
          style={{ color: '#C9A84C' }}
        >
          The Challenge
        </p>

        {/* Headline */}
        <h2
          className="font-display font-bold text-[4.5vw] leading-tight tracking-tight mb-[3.5vh]"
          style={{ color: '#0B1628', textWrap: 'balance' } as React.CSSProperties}
        >
          The problem agents face
        </h2>

        {/* Gold separator */}
        <div
          className="w-[5vw] h-[0.35vh] mb-[4.5vh]"
          style={{ backgroundColor: '#C9A84C' }}
        />

        {/* Bullet 1 */}
        <div className="flex items-start gap-[2.5vw] mb-[3.5vh]">
          <span
            className="flex-shrink-0 w-[0.55vw] h-[0.55vw] rounded-full"
            style={{ backgroundColor: '#C9A84C', marginTop: '1.1vh' }}
          />
          <p
            className="font-body text-[2.2vw] leading-snug"
            style={{ color: '#0B1628' }}
          >
            Creating video content takes hours of editing software most agents don't know
          </p>
        </div>

        {/* Bullet 2 */}
        <div className="flex items-start gap-[2.5vw] mb-[3.5vh]">
          <span
            className="flex-shrink-0 w-[0.55vw] h-[0.55vw] rounded-full"
            style={{ backgroundColor: '#C9A84C', marginTop: '1.1vh' }}
          />
          <p
            className="font-body text-[2.2vw] leading-snug"
            style={{ color: '#0B1628' }}
          >
            Amateur-looking property videos cost deals before buyers ever schedule a showing
          </p>
        </div>

        {/* Bullet 3 */}
        <div className="flex items-start gap-[2.5vw]">
          <span
            className="flex-shrink-0 w-[0.55vw] h-[0.55vw] rounded-full"
            style={{ backgroundColor: '#C9A84C', marginTop: '1.1vh' }}
          />
          <p
            className="font-body text-[2.2vw] leading-snug"
            style={{ color: '#0B1628' }}
          >
            MLS compliance rules make branded content tricky to get right
          </p>
        </div>
      </div>
    </div>
  );
}
