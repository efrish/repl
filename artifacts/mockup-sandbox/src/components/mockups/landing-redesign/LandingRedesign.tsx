import "./landing.css";

export function LandingRedesign() {
  return (
    <div className="lr-landing">
      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav className="lr-nav">
        <div className="lr-nav-brand">
          <div className="lr-mark">LR</div>
          <span className="lr-wordmark">ListingReel</span>
        </div>
        <div className="lr-nav-actions">
          <button className="lr-btn-ghost">Sign in</button>
          <button className="lr-btn-primary">Request access</button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="lr-hero">
        <div className="lr-hero-text">
          <div className="lr-eyebrow">Century 21 Hollywood · Agents only</div>
          <h1 className="lr-hero-heading">
            Turn MLS photos into<br />
            <span className="lr-hero-accent">scroll-stopping reels</span>
          </h1>
          <p className="lr-hero-body">
            Upload up to six property photos and get a branded social-media video
            in minutes — no editing software, no uploads to third-party servers.
            Rendered entirely in your browser.
          </p>
          <div className="lr-hero-cta">
            <button className="lr-btn-primary lr-btn-lg">Request access →</button>
            <span className="lr-cta-note">Approved agents only · Free for your office</span>
          </div>
          <div className="lr-trust-row">
            <div className="lr-trust-item">
              <span className="lr-trust-icon">🔒</span>
              <span>Photos stay on your device</span>
            </div>
            <div className="lr-trust-item">
              <span className="lr-trust-icon">✓</span>
              <span>MLS-safe export</span>
            </div>
            <div className="lr-trust-item">
              <span className="lr-trust-icon">⚡</span>
              <span>Ready in under 2 min</span>
            </div>
          </div>
        </div>

        <div className="lr-hero-visual">
          <div className="lr-phone-frame">
            <div className="lr-phone-notch" />
            <div className="lr-video-preview">
              {/* Simulated property video frame */}
              <div className="lr-video-bg" />
              <div className="lr-video-overlay">
                <div className="lr-video-badge">JUST LISTED</div>
                <div className="lr-video-address">
                  <strong>4 Bed · 3 Bath · 2,400 sqft</strong>
                  <span>Sherman Oaks, CA</span>
                </div>
                <div className="lr-video-agent">
                  <div className="lr-agent-avatar">EF</div>
                  <div>
                    <strong>Edward Frish</strong>
                    <span>Century 21 Hollywood</span>
                  </div>
                </div>
              </div>
              <div className="lr-video-progress">
                <div className="lr-progress-dot active" />
                <div className="lr-progress-dot" />
                <div className="lr-progress-dot" />
                <div className="lr-progress-dot" />
              </div>
            </div>
          </div>
          <div className="lr-platform-tags">
            <span className="lr-tag">Instagram Reels</span>
            <span className="lr-tag">TikTok</span>
            <span className="lr-tag">Facebook</span>
            <span className="lr-tag">LinkedIn</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="lr-steps">
        <div className="lr-steps-header">
          <div className="lr-section-eyebrow">Simple workflow</div>
          <h2 className="lr-steps-heading">A polished listing video in <span className="lr-accent">3 steps</span></h2>
          <p className="lr-steps-sub">No filming. No editing. No expensive software. Just your MLS photos.</p>
        </div>
        <div className="lr-steps-grid">
          <div className="lr-step">
            <div className="lr-step-number">01</div>
            <div className="lr-step-icon">📸</div>
            <h3>Drop your photos</h3>
            <p>Upload up to six of your strongest MLS photos — exterior, kitchen, living room, primary suite, and lifestyle shots. Drag to reorder.</p>
          </div>
          <div className="lr-step-divider">→</div>
          <div className="lr-step">
            <div className="lr-step-number">02</div>
            <div className="lr-step-icon">✏️</div>
            <h3>Add your details</h3>
            <p>Enter the listing address, price, beds/baths, and your agent info. Pick a presentation style and music track.</p>
          </div>
          <div className="lr-step-divider">→</div>
          <div className="lr-step">
            <div className="lr-step-number">03</div>
            <div className="lr-step-icon">🎬</div>
            <h3>Download &amp; post</h3>
            <p>Your browser renders the video in real time. Download a branded social reel or a silent MLS-safe version — both in one click.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="lr-features">
        <div className="lr-section-eyebrow" style={{ textAlign: "center" }}>Why agents choose ListingReel</div>
        <div className="lr-features-grid">
          <div className="lr-feature-card lr-feature-dark">
            <div className="lr-feature-icon-large">🔒</div>
            <h3>Completely private</h3>
            <p>Every photo is rendered locally in your browser. Nothing is uploaded to our servers. Your listing photos never leave your device.</p>
          </div>
          <div className="lr-feature-card">
            <div className="lr-feature-icon-large">📋</div>
            <h3>MLS-safe version</h3>
            <p>One-click export of a clean, silent slideshow that meets MLS compliance rules — no music, no text overlays.</p>
          </div>
          <div className="lr-feature-card">
            <div className="lr-feature-icon-large">🎨</div>
            <h3>Century 21 branded</h3>
            <p>Social videos include your headshot, name, phone number, and Century 21 Hollywood branding — consistent every time.</p>
          </div>
          <div className="lr-feature-card">
            <div className="lr-feature-icon-large">📱</div>
            <h3>Every major platform</h3>
            <p>Output presets for Instagram Reels, TikTok, Facebook, YouTube Shorts, LinkedIn, and X — the right resolution every time.</p>
          </div>
          <div className="lr-feature-card">
            <div className="lr-feature-icon-large">💾</div>
            <h3>Save your listings</h3>
            <p>Up to 6 past listings are saved automatically. Pick up where you left off or pull an old reel for a price-reduction update.</p>
          </div>
          <div className="lr-feature-card">
            <div className="lr-feature-icon-large">⚡</div>
            <h3>Done in minutes</h3>
            <p>From photo upload to finished video in under two minutes — fast enough to post the same day you list.</p>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ────────────────────────────────────────────── */}
      <section className="lr-cta-footer">
        <div className="lr-mark lr-mark-lg">LR</div>
        <h2>Ready to make your listings move?</h2>
        <p>Request access for your Century 21 Hollywood team.</p>
        <button className="lr-btn-primary lr-btn-lg">Request access →</button>
      </section>
    </div>
  );
}
