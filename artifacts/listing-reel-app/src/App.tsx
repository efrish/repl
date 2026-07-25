import { useEffect, useRef, useState } from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  useClerk,
  useUser,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
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

    // First sign-in — provision the role via the API
    if (didRegister.current) return;
    didRegister.current = true;

    fetch(`${API_BASE}/api/users/register`, {
      method: "POST",
      credentials: "include",
    })
      .then((r) => r.json())
      .then(async (data) => {
        await user.reload();
        if (data.role === "admin") setStatus("admin");
        else if (data.approved) setStatus("approved");
        else setStatus("pending");
      })
      .catch(() => setStatus("error"));
  }, [isLoaded, user]);

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
  const [, setLocation] = useLocation();
  return (
    <div className="auth-shell landing">
      <div className="landing-hero">
        <div className="brand-mark landing-mark">LR</div>
        <h1 className="landing-title">ListingReel</h1>
        <p className="landing-sub">Property video studio</p>
        <p className="landing-body">
          Turn up to six MLS photos into a branded social-media slideshow video
          — no editing software required. Available to approved Century 21
          Hollywood agents.
        </p>
        <div className="landing-actions">
          <button
            className="primary-button landing-btn"
            onClick={() => setLocation("/sign-up")}
          >
            Request access
          </button>
          <button
            className="secondary-button landing-btn"
            onClick={() => setLocation("/sign-in")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

/** Auth gate — decides what the authed user sees */
function ProtectedApp() {
  const { user, isLoaded } = useUser();
  const status = useUserStatus();
  const [showAdmin, setShowAdmin] = useState(false);

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
        onOpenAdmin={() => setShowAdmin(true)}
      />
      {showAdmin && status === "admin" && (
        <AdminPanel
          apiBase={API_BASE}
          onClose={() => setShowAdmin(false)}
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
