import { useCallback, useEffect, useRef, useState } from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import PendingApproval from "@/pages/PendingApproval";
import AdminPanel from "@/pages/AdminPanel";

const queryClient = new QueryClient();

// --- Clerk setup (copy verbatim per skill) --------------------------------
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");

const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#b89a5a",
    colorForeground: "#1c1c1e",
    colorMutedForeground: "#6b6565",
    colorDanger: "#e07b54",
    colorBackground: "#f5f2ec",
    colorInput: "#ede8e0",
    colorInputForeground: "#1c1c1e",
    colorNeutral: "#c4bdb3",
    fontFamily: "Georgia, 'Times New Roman', serif",
    borderRadius: "10px",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    cardBox: {
      width: "440px",
      maxWidth: "100%",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
    },
    card: {
      boxShadow: "none",
      border: "none",
      background: "#f5f2ec",
      borderRadius: 0,
    },
    footer: {
      boxShadow: "none",
      border: "none",
      background: "#f5f2ec",
      borderRadius: 0,
    },
    headerTitle: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#1c1c1e",
    },
    headerSubtitle: { color: "#6b6565" },
    socialButtonsBlockButtonText: { color: "#1c1c1e" },
    formFieldLabel: { color: "#1c1c1e" },
    footerActionLink: { color: "#b89a5a" },
    footerActionText: { color: "#6b6565" },
    dividerText: { color: "#6b6565" },
    identityPreviewEditButton: { color: "#b89a5a" },
    formFieldSuccessText: { color: "#3d9d72" },
    alertText: { color: "#e07b54" },
    socialButtonsBlockButton: {
      background: "#ede8e0",
      borderColor: "#c4bdb3",
    },
    formButtonPrimary: { background: "#b89a5a" },
    formFieldInput: {
      background: "#ede8e0",
      borderColor: "#c4bdb3",
      color: "#1c1c1e",
    },
    dividerLine: { background: "#e4ddd3" },
    otpCodeFieldInput: { background: "#ede8e0", borderColor: "#c4bdb3" },
  },
};

// -------------------------------------------------------------------------

type UserStatus = "loading" | "admin" | "approved" | "pending" | "error";

/** Registers new users via the API and returns their status. */
function useUserStatus(): UserStatus {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [status, setStatus] = useState<UserStatus>("loading");
  const didRegister = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setStatus("loading"); return; }

    const meta = user.publicMetadata as { role?: string; approved?: boolean };

    if (meta?.role) {
      if (meta.role === "admin") setStatus("admin");
      else if (meta.approved) setStatus("approved");
      else setStatus("pending");
      return;
    }

    // First sign-in — provision the role via the API.
    // Pass the session token explicitly as a Bearer header so the Express
    // clerkMiddleware can validate it even when proxy cookie forwarding is
    // unreliable (Vite dev proxy → localhost).
    if (didRegister.current) return;
    didRegister.current = true;

    getToken()
      .then((token) =>
        fetch(`${API_BASE}/api/users/register`, {
          method: "POST",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
      )
      .then((r) => r.json())
      .then(async (data) => {
        await user.reload();
        if (data.role === "admin") setStatus("admin");
        else if (data.approved) setStatus("approved");
        else setStatus("pending");
      })
      .catch(() => setStatus("error"));
  }, [isLoaded, user, getToken]);

  return status;
}

// --- Page components -------------------------------------------------------

function SignInPage() {
  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div className="brand-mark auth-mark">LR</div>
          <strong className="auth-brand-name">ListingReel</strong>
          <p className="auth-brand-tagline">Property video studio</p>
          <p className="auth-brand-sub">
            Turn MLS photos into branded social-media slideshows in minutes.
          </p>
        </div>
      </div>
      <div className="auth-form-panel">
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div className="brand-mark auth-mark">LR</div>
          <strong className="auth-brand-name">ListingReel</strong>
          <p className="auth-brand-tagline">Property video studio</p>
          <p className="auth-brand-sub">
            Request access to start creating scroll-stopping property videos.
          </p>
        </div>
      </div>
      <div className="auth-form-panel">
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
        />
      </div>
    </div>
  );
}

/** Landing page for signed-out visitors */
function Landing() {
  return (
    <div className="lr-landing">
      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="lr-nav">
        <div className="lr-nav-brand">
          <div className="lr-mark">LR</div>
          <div>
            <span className="lr-wordmark">ListingReel</span>
            <span className="lr-nav-byline">by Edward Frish</span>
          </div>
        </div>
        <div className="lr-nav-actions">
          <Link href="/sign-in" className="lr-btn-ghost">Sign in</Link>
          <Link href="/sign-up" className="lr-btn-primary">Request access</Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
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
            <Link href="/sign-up" className="lr-btn-primary lr-btn-lg">Request access →</Link>
            <span className="lr-cta-note">Approved agents only · Free for your office</span>
          </div>
          <div className="lr-trust-row">
            <div className="lr-trust-item"><span className="lr-trust-icon">🔒</span><span>Photos stay on your device</span></div>
            <div className="lr-trust-item"><span className="lr-trust-icon">✓</span><span>MLS-safe export</span></div>
            <div className="lr-trust-item"><span className="lr-trust-icon">⚡</span><span>Ready in under 2 min</span></div>
          </div>
        </div>

        <div className="lr-hero-visual">
          <div className="lr-phone-frame">
            <div className="lr-phone-notch" />
            <div className="lr-video-preview">
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

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
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

      {/* ── FEATURES ─────────────────────────────────────────────── */}
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

      {/* ── CTA FOOTER ───────────────────────────────────────────── */}
      <section className="lr-cta-footer">
        <div className="lr-mark lr-mark-lg">LR</div>
        <h2>Ready to make your listings move?</h2>
        <p>Request access for your Century 21 Hollywood team.</p>
        <Link href="/sign-up" className="lr-btn-primary lr-btn-lg">Request access →</Link>
      </section>
    </div>
  );
}

/** Auth gate — decides what the authed user sees */
function ProtectedApp() {
  const { user, isLoaded } = useUser();
  const status = useUserStatus();
  const [showAdmin, setShowAdmin] = useState(false);
  const openAdmin = useCallback(() => setShowAdmin(true), []);
  const closeAdmin = useCallback(() => setShowAdmin(false), []);

  if (!isLoaded || (user && status === "loading")) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  if (!user) return <Landing />;

  if (status === "pending" || status === "error") {
    return <PendingApproval />;
  }

  return (
    <>
      <Home
        isAdmin={status === "admin"}
        onOpenAdmin={openAdmin}
      />
      {showAdmin && status === "admin" && (
        <AdminPanel
          apiBase={API_BASE}
          onClose={closeAdmin}
        />
      )}
    </>
  );
}

// --- Router ---------------------------------------------------------------

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your ListingReel account",
          },
        },
        signUp: {
          start: {
            title: "Request access",
            subtitle: "Create your ListingReel account",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/" component={ProtectedApp} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}
