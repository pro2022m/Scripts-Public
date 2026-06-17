import { KeyRound } from "lucide-react";

import { requirePermission } from "@/lib/rbac";
import { permissionsByArea } from "@/lib/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Permissions · Admin" };

const AREA_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  freshdesk: "Freshdesk",
  claude: "Claude",
  kb: "Knowledge Base",
  admin: "Admin",
};

export default async function AdminPermissionsPage() {
  await requirePermission("admin.permissions.read");
  const grouped = permissionsByArea();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" /> Permission catalog
          </CardTitle>
          <CardDescription>
            The complete list of permission keys recognised by the system. Roles bundle these,
            and per-user grants/denies layer on top.
          </CardDescription>
        </CardHeader>
      </Card>

      {Object.entries(grouped).map(([area, perms]) => (
        <Card key={area}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">{AREA_LABELS[area] ?? area}</CardTitle>
            <Badge variant="muted">{perms.length}</Badge>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/60">
              {perms.map((p) => (
                <li
                  key={p.key}
                  className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] text-foreground">{p.key}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge variant="outline" className="font-mono">
                      {p.action}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
