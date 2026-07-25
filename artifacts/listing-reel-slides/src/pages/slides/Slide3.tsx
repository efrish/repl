export default function Slide3() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#F5F4F0' }}
    >
      {/* Subtle background wash on right half */}
      <div
        className="absolute top-0 right-0 w-[50vw] h-full"
        style={{ backgroundColor: 'rgba(11,22,40,0.04)' }}
      />

      {/* Content — two column layout */}
      <div className="absolute inset-0 flex items-center px-[8vw] gap-[5vw]">

        {/* Left column — headline */}
        <div className="flex flex-col justify-center w-[38vw] flex-shrink-0">
          <p
            className="font-body text-[1.5vw] tracking-[0.32em] uppercase mb-[2vh] font-semibold"
            style={{ color: '#C9A84C' }}
          >
            How It Works
          </p>
          <h2
            className="font-display font-bold text-[3.8vw] leading-tight tracking-tight mb-[3vh]"
            style={{ color: '#0B1628', textWrap: 'balance' } as React.CSSProperties}
          >
            A five-step studio in your browser
          </h2>
          <div
            className="w-[5vw] h-[0.35vh] mb-[3vh]"
            style={{ backgroundColor: '#C9A84C' }}
          />
          <p
            className="font-body text-[1.8vw] leading-relaxed"
            style={{ color: '#7A7A6E', maxWidth: '32vw' }}
          >
            From upload to HD export in minutes. No software to install, no photos leave your device.
          </p>
        </div>

        {/* Right column — numbered steps */}
        <div className="flex flex-col gap-[2.8vh] flex-1">

          {/* Step 01 */}
          <div className="flex items-start gap-[2vw]">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full font-display font-bold text-[1.5vw]"
              style={{
                width: '3.4vw',
                height: '3.4vw',
                backgroundColor: '#C9A84C',
                color: '#0B1628',
              }}
            >
              01
            </span>
            <p
              className="font-body text-[1.9vw] leading-snug"
              style={{ color: '#0B1628', paddingTop: '0.5vh' }}
            >
              Upload up to 6 MLS photos and set their order
            </p>
          </div>

          {/* Step 02 */}
          <div className="flex items-start gap-[2vw]">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full font-display font-bold text-[1.5vw]"
              style={{
                width: '3.4vw',
                height: '3.4vw',
                backgroundColor: '#0B1628',
                color: '#C9A84C',
              }}
            >
              02
            </span>
            <p
              className="font-body text-[1.9vw] leading-snug"
              style={{ color: '#0B1628', paddingTop: '0.5vh' }}
            >
              Fill in property details: address, price, beds, baths, sq ft
            </p>
          </div>

          {/* Step 03 */}
          <div className="flex items-start gap-[2vw]">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full font-display font-bold text-[1.5vw]"
              style={{
                width: '3.4vw',
                height: '3.4vw',
                backgroundColor: '#C9A84C',
                color: '#0B1628',
              }}
            >
              03
            </span>
            <p
              className="font-body text-[1.9vw] leading-snug"
              style={{ color: '#0B1628', paddingTop: '0.5vh' }}
            >
              Add agent name, headshot, brokerage logo, and contact info
            </p>
          </div>

          {/* Step 04 */}
          <div className="flex items-start gap-[2vw]">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full font-display font-bold text-[1.5vw]"
              style={{
                width: '3.4vw',
                height: '3.4vw',
                backgroundColor: '#0B1628',
                color: '#C9A84C',
              }}
            >
              04
            </span>
            <p
              className="font-body text-[1.9vw] leading-snug"
              style={{ color: '#0B1628', paddingTop: '0.5vh' }}
            >
              Choose a visual style: Editorial, Modern, or Social Energy
            </p>
          </div>

          {/* Step 05 */}
          <div className="flex items-start gap-[2vw]">
            <span
              className="flex-shrink-0 flex items-center justify-center rounded-full font-display font-bold text-[1.5vw]"
              style={{
                width: '3.4vw',
                height: '3.4vw',
                backgroundColor: '#C9A84C',
                color: '#0B1628',
              }}
            >
              05
            </span>
            <p
              className="font-body text-[1.9vw] leading-snug"
              style={{ color: '#0B1628', paddingTop: '0.5vh' }}
            >
              Preview and export HD video — MP4 or WebM, no upload required
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
