"use client";

import { useSession } from "next-auth/react";
import type { PermissionKey } from "@/lib/permissions";

export function usePermission(perm: PermissionKey): boolean {
  const { data } = useSession();
  if (!data?.user) return false;
  if (data.user.isOwner) return true;
  return data.user.permissions?.includes(perm) ?? false;
}

export function useAnyPermission(perms: readonly PermissionKey[]): boolean {
  const { data } = useSession();
  if (!data?.user) return false;
  if (data.user.isOwner) return true;
  return perms.some((p) => data.user.permissions?.includes(p));
}
