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

type Tab = "pending" | "approved" | "all";

export default function AdminPanel({ apiBase, onClose }: AdminPanelProps) {
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [busy, setBusy] = useState<string | null>(null);

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

  async function revoke(id: string) {
    if (!confirm("Revoke this user's access? They'll see the pending screen again.")) return;
    setBusy(id);
    await fetch(`${apiBase}/api/admin/users/${id}`, {
      method: "DELETE",
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
        </div>

        {/* Body */}
        <div className="admin-body">
          {loading && (
            <div className="admin-loading">
              <div className="auth-loading-spinner" />
              <span>Loading users…</span>
            </div>
          )}

          {error && (
            <div className="admin-error">
              {error}
              <button onClick={fetchUsers}>Retry</button>
            </div>
          )}

          {!loading && !error && displayed.length === 0 && (
            <div className="admin-empty">
              {tab === "pending"
                ? "No pending requests right now."
                : tab === "approved"
                ? "No approved users yet."
                : "No users found."}
            </div>
          )}

          {!loading && !error && displayed.length > 0 && (
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
                          className="admin-btn revoke"
                          onClick={() => revoke(u.id)}
                          disabled={isBusy}
                        >
                          {isBusy ? "…" : "Revoke access"}
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
