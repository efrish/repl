import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";

const router = Router();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = auth.userId;
  next();
}

/**
 * POST /api/users/register
 * Called by the frontend after sign-in to provision the user's role.
 * Idempotent — safe to call on every sign-in; skips if role already set.
 */
router.post("/users/register", requireAuth, async (req: any, res: any) => {

  const { userId } = req;
  try {
    const user = await clerkClient.users.getUser(userId);

    // Already provisioned — return current state
    if (user.publicMetadata?.role) {
      return res.json({
        role: user.publicMetadata.role,
        approved: user.publicMetadata.approved,
      });
    }

    const primaryEmail =
      user.emailAddresses
        .find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress?.toLowerCase()
        .trim() ?? "";

    const isAdmin = Boolean(ADMIN_EMAIL && primaryEmail === ADMIN_EMAIL);

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: isAdmin ? "admin" : "agent",
        approved: isAdmin,
      },
    });

    res.json({ role: isAdmin ? "admin" : "agent", approved: isAdmin });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
