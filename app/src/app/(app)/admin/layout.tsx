import { redirect } from "next/navigation";

import { hasAnyPermission } from "@/lib/rbac";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/common/PageHeader";

import { AdminTabs } from "./AdminTabs";

const TABS = [
  { href: "/admin/users", label: "Users", any: ["admin.users.read", "admin.users.manage"] as const },
  { href: "/admin/roles", label: "Roles", any: ["admin.roles.read", "admin.roles.manage"] as const },
  { href: "/admin/permissions", label: "Permissions", any: ["admin.permissions.read", "admin.permissions.manage"] as const },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user ?? null;
  if (!hasAnyPermission(user, TABS.flatMap((t) => t.any))) redirect("/403");

  const visibleTabs = TABS.filter((t) => hasAnyPermission(user, t.any)).map((t) => ({
    href: t.href,
    label: t.label,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Manage identity, roles, and the permission catalog."
      />
      <AdminTabs tabs={visibleTabs} />
      <div>{children}</div>
    </div>
  );
}
