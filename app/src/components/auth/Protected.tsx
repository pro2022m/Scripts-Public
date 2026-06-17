"use client";

import type { PermissionKey } from "@/lib/permissions";
import { usePermission } from "@/lib/hooks/usePermission";

export function Protected({
  perm,
  fallback = null,
  children,
}: {
  perm: PermissionKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const allowed = usePermission(perm);
  return <>{allowed ? children : fallback}</>;
}
