# Atlas — Internal Console

Internal operations console: a clean Next.js 15 + TypeScript foundation with a Todoist-inspired UI shell, identity, and a CIPP-style RBAC permissions hierarchy.

This first slice ships **no business features**. The goal is a polished shell + a permissions model we won't have to revisit.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS 3 + shadcn-style primitives + `next-themes` (dark default, electric green accent)
- Postgres (Vercel Postgres / Neon) + Prisma
- Auth.js v5 with Microsoft Entra ID **and** local credentials (Argon2id)
- Deploy target: Vercel

## Getting started

```bash
cd app
pnpm install
cp .env.example .env
# fill in DATABASE_URL, AUTH_SECRET, optionally AUTH_MICROSOFT_ENTRA_ID_*, and SEED_OWNER_EMAIL
pnpm db:migrate          # creates the schema
pnpm db:seed             # seeds permissions, system roles, and the owner user
pnpm dev                 # http://localhost:3000
```

## Permissions model

CIPP-style: roles bundle permissions, and individual users can have grants/denies layered on top.

Effective permission for a user:

```
isOwner                   → all permissions
DENY override on perm     → not granted (DENY wins)
GRANT override on perm    → granted
permission in any role    → granted
otherwise                 → not granted
```

The catalog lives in `src/lib/permissions.ts` and is mirrored into the `Permission` table by the seed.

### Server-side guards

```ts
import { requirePermission, hasPermission, guardRoute } from "@/lib/rbac";

// In a server component / page
await requirePermission("admin.users.read");

// In a Route Handler
const guard = await guardRoute("admin.users.manage");
if (!guard.ok) return guard.response;
```

### Client-side guards

```tsx
import { Protected } from "@/components/auth/Protected";
import { usePermission } from "@/lib/hooks/usePermission";

<Protected perm="admin.users.manage">
  <button>Add user</button>
</Protected>;

const canEdit = usePermission("kb.articles.write");
```

## Layout

```
app/
  prisma/                    # schema + seed
  src/
    app/
      (auth)/login           # MS SSO + local login
      (app)/                 # protected app shell
        dashboard
        freshdesk
        claude
        knowledge-base
        admin/{users,roles,permissions}
      api/auth/[...nextauth]
      403                    # forbidden page
    components/
      shell/                 # Sidebar, TopBar, UserMenu, ThemeToggle
      auth/                  # LoginCard, Protected
      common/                # EmptyState, PageHeader
      ui/                    # button, card, input, dropdown-menu, etc.
    lib/
      auth.ts                # Auth.js v5 config
      rbac.ts                # getEffectiveAccess, requirePermission, ...
      permissions.ts         # PERMISSIONS catalog + SYSTEM_ROLES
      prisma.ts              # singleton client
      hooks/usePermission.ts
    middleware.ts            # auth-required redirect
```

## Adding a permission

1. Add the key to the `PermissionKey` union and the `PERMISSIONS` array in `src/lib/permissions.ts`.
2. (Optional) Add it to a `SYSTEM_ROLES` entry.
3. Run `pnpm db:seed`.
4. Use `requirePermission("…")` / `usePermission("…")` where needed.
