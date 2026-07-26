import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useClerk } from "@clerk/react";

interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
  approved: boolean | null;
  createdAt: number;
}

interface AdminPanelProps {
  apiBase: string;
  onClose: () => void;
}

type Tab = "pending" | "approved" | "all" | "invite";

export default function AdminPanel({ apiBase, onClose }: AdminPanelProps) {
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [busy, setBusy] = useState<string | null>(null);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const signupUrl = `${window.location.origin}${import.meta.env.BASE_URL}sign-up`;

  function copyLink() {
    navigator.clipboard.writeText(signupUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function openEmail() {
    const to = inviteEmail.trim();
    const subject = encodeURIComponent("You're invited to ListingReel — Century 21 Hollywood");
    const body = encodeURIComponent(
      `Hi${to ? "" : " there"},\n\nI'd like to invite you to ListingReel, a tool I built exclusively for Century 21 Hollywood agents that turns your MLS photos into branded listing videos in under a minute.\n\nClick the link below to create your account:\n${signupUrl}\n\nOnce you sign up, I'll approve your access and you'll be ready to go.\n\nEdward Frish\nCentury 21 Hollywood`
    );
    window.open(`mailto:${to}?subject=${subject}&body=${body}`);
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/admin/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function approve(id: string) {
    setBusy(id);
    await fetch(`${apiBase}/api/admin/users/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    setBusy(null);
    fetchUsers();
  }

  async function reject(id: string) {
    if (!confirm("Delete this user's account entirely?")) return;
    setBusy(id);
    await fetch(`${apiBase}/api/admin/users/${id}/reject`, {
      method: "POST",
      credentials: "include",
    });
    setBusy(null);
    fetchUsers();
  }

  async function remove(id: string) {
    if (!confirm("Remove this agent? Their account will be deleted and they'll need to sign up again.")) return;
    setBusy(id);
    await fetch(`${apiBase}/api/admin/users/${id}/reject`, {
      method: "POST",
      credentials: "include",
    });
    setBusy(null);
    fetchUsers();
  }


  const pending = users.filter((u) => u.role && !u.approved);
  const approved = users.filter((u) => u.approved);
  const unregistered = users.filter((u) => !u.role);

  const displayed =
    tab === "pending"
      ? [...unregistered, ...pending]
      : tab === "approved"
      ? approved
      : users;

  return createPortal(
    <div className="admin-overlay">
      <div className="admin-panel">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <button className="admin-back-btn" onClick={onClose}>
              ← Back to Studio
            </button>
            <h1 className="admin-title">User Management</h1>
          </div>
          <button
            className="pending-signout"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab${tab === "pending" ? " active" : ""}`}
            onClick={() => setTab("pending")}
          >
            Pending
            {(pending.length + unregistered.length) > 0 && (
              <span className="admin-tab-badge">
                {pending.length + unregistered.length}
              </span>
            )}
          </button>
          <button
            className={`admin-tab${tab === "approved" ? " active" : ""}`}
            onClick={() => setTab("approved")}
          >
            Approved
            {approved.length > 0 && (
              <span className="admin-tab-badge approved">{approved.length}</span>
            )}
          </button>
          <button
            className={`admin-tab${tab === "all" ? " active" : ""}`}
            onClick={() => setTab("all")}
          >
            All users ({users.length})
          </button>
          <button
            className={`admin-tab${tab === "invite" ? " active" : ""}`}
            onClick={() => setTab("invite")}
          >
            ✉ Invite
          </button>
        </div>

        {/* Body */}
        <div className="admin-body">
          {tab !== "invite" && loading && (
            <div className="admin-loading">
              <div className="auth-loading-spinner" />
              <span>Loading users…</span>
            </div>
          )}

          {tab !== "invite" && error && (
            <div className="admin-error">
              {error}
              <button onClick={fetchUsers}>Retry</button>
            </div>
          )}

          {tab !== "invite" && !loading && !error && displayed.length === 0 && (
            <div className="admin-empty">
              {tab === "pending"
                ? "No pending requests right now."
                : tab === "approved"
                ? "No approved users yet."
                : "No users found."}
            </div>
          )}

          {tab === "invite" && (
            <div className="admin-invite-section">
              <h2 className="admin-invite-heading">Invite an agent</h2>
              <p className="admin-invite-desc">
                Share your sign-up link with any agent. They create their account,
                then appear in your Pending queue for approval.
              </p>

              {/* Sign-up link */}
              <div className="admin-invite-link-label">Sign-up link</div>
              <div className="admin-invite-link-row">
                <div className="admin-invite-link-box">{signupUrl}</div>
                <button className="admin-btn approve admin-invite-copy-btn" onClick={copyLink}>
                  {copied ? "✓ Copied!" : "Copy link"}
                </button>
              </div>

              {/* Email composer */}
              <div className="admin-invite-divider">— or compose an email —</div>
              <div className="admin-invite-form">
                <input
                  className="admin-invite-input"
                  type="email"
                  placeholder="agent@example.com (optional)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button className="admin-btn approve" onClick={openEmail}>
                  Open in email app
                </button>
              </div>
              <p className="admin-invite-desc" style={{ marginTop: "0.75rem" }}>
                Opens your email client with a pre-written invitation. Leave the
                field blank to fill the address yourself.
              </p>
            </div>
          )}

          {tab !== "invite" && !loading && !error && displayed.length > 0 && (
            <div className="admin-user-list">
              {displayed.map((u) => {
                const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
                const isBusy = busy === u.id;
                const isPending = !u.approved;
                const isApproved = Boolean(u.approved);

                return (
                  <div key={u.id} className={`admin-user-row${isBusy ? " busy" : ""}`}>
                    <div className="admin-user-avatar">
                      {(u.firstName?.[0] ?? u.email[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                      <strong className="admin-user-name">
                        {name || u.email}
                      </strong>
                      {name && <span className="admin-user-email">{u.email}</span>}
                      <span className="admin-user-date">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="admin-user-status">
                      {!u.role && (
                        <span className="admin-badge unregistered">Unregistered</span>
                      )}
                      {u.role && isApproved && (
                        <span className="admin-badge approved-badge">Approved</span>
                      )}
                      {u.role && isPending && (
                        <span className="admin-badge pending-badge">Pending</span>
                      )}
                    </div>
                    <div className="admin-user-actions">
                      {isPending && u.role && (
                        <>
                          <button
                            className="admin-btn approve"
                            onClick={() => approve(u.id)}
                            disabled={isBusy}
                          >
                            {isBusy ? "…" : "Approve"}
                          </button>
                          <button
                            className="admin-btn reject"
                            onClick={() => reject(u.id)}
                            disabled={isBusy}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {isApproved && u.role !== "admin" && (
                        <button
                          className="admin-btn remove"
                          onClick={() => remove(u.id)}
                          disabled={isBusy}
                        >
                          {isBusy ? "…" : "Remove"}
                        </button>
                      )}
                      {u.role === "admin" && (
                        <span className="admin-badge admin-badge-role">Admin</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-footer">
          <button className="admin-refresh" onClick={fetchUsers}>
            ↻ Refresh
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
