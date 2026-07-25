---
name: ListingReel Clerk Auth Setup
description: How authentication is implemented — architecture, user flow, admin management, env vars, and key files.
---

# ListingReel Clerk Auth

## Architecture
- **Clerk** (Replit-managed, `not_configured` → provisioned via `setupClerkWhitelabelAuth()`)
- **API server** (port 8080) handles Clerk proxy middleware + user registration + admin routes
- **Frontend** (listing-reel-app) wraps the studio in Clerk auth; unauthenticated users see a branded landing page

## User Flow
1. Visitor sees Landing page (`/`) → clicks "Request access" → `/sign-up`
2. After sign-up, frontend calls `POST /api/users/register` which sets `publicMetadata: { role, approved }`
3. If email matches `ADMIN_EMAIL` → `role: "admin", approved: true` → goes straight to studio
4. Otherwise → `role: "agent", approved: false` → sees PendingApproval screen
5. Admin approves via the Users panel (⚙ Users button in topbar, admin-only)
6. On next page load, `user.reload()` picks up updated `publicMetadata`

## Key Env Vars
- `ADMIN_EMAIL=efrish@c21edva.com` — this email auto-gets admin role on first sign-in
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — auto-provisioned
- `VITE_CLERK_PROXY_URL` — empty in dev (intentional), auto-set in prod
- `VITE_API_BASE_URL` — empty in dev (Vite proxy handles `/api`), set to API server URL in prod

## Dev Proxy
`listing-reel-app/vite.config.ts` proxies `/api/*` → `http://localhost:8080` in dev.

## API Routes
- `POST /api/users/register` — idempotent JIT provisioning; sets publicMetadata
- `GET /api/admin/users` — list all users (admin only)
- `POST /api/admin/users/:id/approve` — set approved: true
- `POST /api/admin/users/:id/reject` — delete Clerk account entirely
- `DELETE /api/admin/users/:id` — revoke access (set approved: false)

## Key Files
- `artifacts/listing-reel-app/src/App.tsx` — ClerkProvider, routing, ProtectedApp gate, Landing page
- `artifacts/listing-reel-app/src/pages/PendingApproval.tsx` — waiting screen
- `artifacts/listing-reel-app/src/pages/AdminPanel.tsx` — admin user management overlay
- `artifacts/api-server/src/routes/users.ts` — register endpoint
- `artifacts/api-server/src/routes/admin.ts` — admin CRUD endpoints
- `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts` — Clerk proxy

**Why:** Two Clerk environments (dev/prod) are isolated — accounts made in dev don't carry to prod.
**How to apply:** When debugging auth, check `user.publicMetadata.role` and `approved`. If missing, the `/api/users/register` call didn't complete. If present but stale, call `user.reload()`.
