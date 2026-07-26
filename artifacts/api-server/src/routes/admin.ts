import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = auth.userId;
  next();
}

async function requireAdmin(req: any, res: any, next: any) {
  try {
    const user = await clerkClient.users.getUser(req.userId);
    if (user.publicMetadata?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}

/** GET /api/admin/users — list all users */
router.get(
  "/admin/users",
  requireAuth,
  requireAdmin,
  async (_req: any, res: any) => {
    try {
      const response = await clerkClient.users.getUserList({
        limit: 200,
        orderBy: "-created_at",
      });
      const users = response.data.map((u) => ({
        id: u.id,
        email:
          u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
            ?.emailAddress ?? "",
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        role: (u.publicMetadata?.role as string) ?? null,
        approved: (u.publicMetadata?.approved as boolean) ?? null,
        createdAt: u.createdAt,
      }));
      res.json({ users });
    } catch (err) {
      console.error("List users error:", err);
      res.status(500).json({ error: "Failed to list users" });
    }
  },
);

/** POST /api/admin/users/:id/approve */
router.post(
  "/admin/users/:id/approve",
  requireAuth,
  requireAdmin,
  async (req: any, res: any) => {
    try {
      await clerkClient.users.updateUserMetadata(req.params.id, {
        publicMetadata: { role: "agent", approved: true },
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Approve error:", err);
      res.status(500).json({ error: "Failed to approve user" });
    }
  },
);

/** POST /api/admin/users/:id/reject — deletes the Clerk account entirely */
router.post(
  "/admin/users/:id/reject",
  requireAuth,
  requireAdmin,
  async (req: any, res: any) => {
    try {
      await clerkClient.users.deleteUser(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("Reject error:", err);
      res.status(500).json({ error: "Failed to reject user" });
    }
  },
);

/** DELETE /api/admin/users/:id — revoke an approved user's access */
router.delete(
  "/admin/users/:id",
  requireAuth,
  requireAdmin,
  async (req: any, res: any) => {
    try {
      await clerkClient.users.updateUserMetadata(req.params.id, {
        publicMetadata: { role: "agent", approved: false },
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Revoke error:", err);
      res.status(500).json({ error: "Failed to revoke access" });
    }
  },
);

/** POST /api/admin/invite — send a Clerk email invitation */
router.post(
  "/admin/invite",
  requireAuth,
  requireAdmin,
  async (req: any, res: any) => {
    const { email, redirectUrl } = req.body as { email?: string; redirectUrl?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    try {
      await clerkClient.invitations.createInvitation({
        emailAddress: email.trim().toLowerCase(),
        ...(redirectUrl ? { redirectUrl } : {}),
      });
      res.json({ success: true });
    } catch (err: any) {
      console.error("Invite error:", err);
      const msg = err?.errors?.[0]?.longMessage ?? err?.message ?? "Failed to send invitation";
      res.status(500).json({ error: msg });
    }
  },
);

export default router;
