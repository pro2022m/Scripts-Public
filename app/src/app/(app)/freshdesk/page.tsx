import { LifeBuoy } from "lucide-react";

import { requirePermission } from "@/lib/rbac";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata = { title: "Freshdesk · Atlas" };

export default async function FreshdeskPage() {
  await requirePermission("freshdesk.tickets.read");
  return (
    <>
      <PageHeader
        title="Freshdesk"
        description="Tickets, contacts, and conversations from the Freshdesk workspace."
      />
      <EmptyState
        icon={LifeBuoy}
        title="Freshdesk integration is on the way"
        description="This page will surface live tickets, replies, and SLA timers — pulled directly from your Freshdesk workspace and indexed for search."
        hint="Wire-up: API key + domain in /admin/settings, then this page renders the inbox."
      />
    </>
  );
}
