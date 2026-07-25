import { useClerk } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function PendingApproval() {
  const { signOut } = useClerk();

  return (
    <div className="auth-shell">
      <div className="auth-card pending-card">
        <div className="pending-icon">⏳</div>
        <h1 className="pending-title">Request received</h1>
        <p className="pending-body">
          Your account is waiting for approval. The administrator will review
          your request and grant access shortly.
        </p>
        <p className="pending-hint">
          You'll be able to sign in and use ListingReel once your account has
          been approved. Feel free to close this window and come back later.
        </p>
        <button
          className="pending-signout"
          onClick={() => signOut({ redirectUrl: basePath || "/" })}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
