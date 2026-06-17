import { Users2 } from "lucide-react";

import { requirePermission } from "@/lib/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Users · Admin" };

const COLUMNS = ["Name", "Email", "Roles", "Source", "Status", "Last seen"] as const;

export default async function AdminUsersPage() {
  await requirePermission("admin.users.read");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="size-4 text-primary" /> Users
          </CardTitle>
          <CardDescription>
            People with access to the console. CRUD lands in the next slice.
          </CardDescription>
        </div>
        <Badge variant="muted">Read-only preview</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {COLUMNS.map((c) => (
                  <th key={c} className="px-4 py-2.5 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-muted-foreground">
                  No users to display yet — wire up the listing in the next iteration.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
