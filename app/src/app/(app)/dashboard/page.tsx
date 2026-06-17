import { LayoutDashboard, Activity, Users2, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard · Atlas" };

export default async function DashboardPage() {
  await requirePermission("dashboard.view");
  const session = await auth();
  const name = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${name}.`}
        description="A clean slate. Feature areas land here as we build them out."
        actions={<Badge variant="purple">v0.1 · Foundation</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Open tickets" value="—" hint="Freshdesk integration coming soon" icon={<LayoutDashboard className="size-4" />} />
        <StatCard label="Active users" value="—" hint="Identity wiring is live" icon={<Users2 className="size-4" />} />
        <StatCard label="Claude sessions" value="—" hint="Knowledge & chat coming soon" icon={<Sparkles className="size-4" />} />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            What&apos;s next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <Item index={1} title="Wire users / roles CRUD" body="Tables already shaped &mdash; admin pages need their write paths." />
          <Item index={2} title="Freshdesk ingest" body="Pull ticket lists, support webhook updates, link to clients." />
          <Item index={3} title="Claude assistant" body="Chat with a knowledge-grounded model across the org's content." />
          <Item index={4} title="Knowledge base" body="Internal articles with publishing workflow and search." />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-2xl" />
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>{label}</span>
          <span className="grid size-7 place-items-center rounded-md bg-primary/15 text-primary">
            {icon}
          </span>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function Item({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
        {index}
      </span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs">{body}</p>
      </div>
    </div>
  );
}
