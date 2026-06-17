import { BookText } from "lucide-react";

import { requirePermission } from "@/lib/rbac";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata = { title: "Knowledge Base · Atlas" };

export default async function KnowledgeBasePage() {
  await requirePermission("kb.articles.read");
  return (
    <>
      <PageHeader
        title="Knowledge Base"
        description="Internal articles, runbooks, and how-tos."
      />
      <EmptyState
        icon={BookText}
        title="Knowledge base is on the roadmap"
        description="A first-class place for internal articles, with drafts, reviews, and publishing controls. Searchable and grounded into Claude."
        hint="Drafts → review → publish — gated by kb.articles.write and kb.articles.publish."
      />
    </>
  );
}
