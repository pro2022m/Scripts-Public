import { ShieldCheck } from "lucide-react";

import { requirePermission } from "@/lib/rbac";
import { SYSTEM_ROLES } from "@/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Roles · Admin" };

export default async function AdminRolesPage() {
  await requirePermission("admin.roles.read");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Roles
          </CardTitle>
          <CardDescription>
            Built-in roles plus any custom roles created later. Custom role CRUD coming soon.
          </CardDescription>
        </div>
        <Badge variant="muted">Read-only preview</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SYSTEM_ROLES.map((role) => (
            <div
              key={role.key}
              className="rounded-lg border border-border/70 bg-card/50 p-4 transition-colors hover:bg-card"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{role.name}</h3>
                <Badge variant="purple">System</Badge>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {role.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="muted">{role.permissions.length} permissions</Badge>
              </div>
            </div>
          ))}
          <div className="grid place-items-center rounded-lg border border-dashed border-border/70 bg-card/30 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Create custom role
              <br />
              <span className="text-[11px] uppercase tracking-wider">coming soon</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
