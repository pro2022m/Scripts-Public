import "server-only";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { PermissionKey } from "@/lib/permissions";
import { auth } from "@/lib/auth";

export interface EffectiveAccess {
  isOwner: boolean;
  roles: { key: string; name: string }[];
  permissions: PermissionKey[];
}

/**
 * Compute the effective permission set for a user.
 *
 *   isOwner                  → all permissions
 *   DENY override on perm    → not granted (DENY wins)
 *   GRANT override on perm   → granted
 *   permission in any role   → granted
 *   otherwise                → not granted
 */
export async function getEffectiveAccess(userId: string): Promise<EffectiveAccess> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isOwner: true,
      roles: {
        select: {
          role: {
            select: {
              key: true,
              name: true,
              permissions: { select: { permissionKey: true } },
            },
          },
        },
      },
      overrides: { select: { permissionKey: true, effect: true } },
    },
  });

  if (!user) {
    return { isOwner: false, roles: [], permissions: [] };
  }

  const roles = user.roles.map((r) => ({ key: r.role.key, name: r.role.name }));

  if (user.isOwner) {
    const all = await prisma.permission.findMany({ select: { key: true } });
    return {
      isOwner: true,
      roles,
      permissions: all.map((p) => p.key as PermissionKey),
    };
  }

  const granted = new Set<string>();
  for (const ur of user.roles) {
    for (const rp of ur.role.permissions) granted.add(rp.permissionKey);
  }
  for (const o of user.overrides) {
    if (o.effect === "GRANT") granted.add(o.permissionKey);
    if (o.effect === "DENY") granted.delete(o.permissionKey);
  }

  return {
    isOwner: false,
    roles,
    permissions: [...granted] as PermissionKey[],
  };
}

/** Pure helper — works against a session.user.permissions list. */
export function hasPermission(
  access: { isOwner: boolean; permissions: readonly PermissionKey[] } | null | undefined,
  perm: PermissionKey,
): boolean {
  if (!access) return false;
  if (access.isOwner) return true;
  return access.permissions.includes(perm);
}

export function hasAnyPermission(
  access: { isOwner: boolean; permissions: readonly PermissionKey[] } | null | undefined,
  perms: readonly PermissionKey[],
): boolean {
  if (!access) return false;
  if (access.isOwner) return true;
  return perms.some((p) => access.permissions.includes(p));
}

/**
 * Redirect to /login if no session; redirect to /403 if the permission is missing.
 * Use in server components and server actions.
 */
export async function requirePermission(perm: PermissionKey) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (!hasPermission(session.user, perm)) {
    redirect("/403");
  }
  return session;
}

/** Same as `requirePermission` but for Route Handlers — returns a Response on failure. */
export async function guardRoute(perm: PermissionKey) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, response: new Response("Unauthorized", { status: 401 }) };
  }
  if (!hasPermission(session.user, perm)) {
    return { ok: false as const, response: new Response("Forbidden", { status: 403 }) };
  }
  return { ok: true as const, session };
}
