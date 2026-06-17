import { Sparkles } from "lucide-react";

import { requirePermission } from "@/lib/rbac";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata = { title: "Claude · Atlas" };

export default async function ClaudePage() {
  await requirePermission("claude.chat.use");
  return (
    <>
      <PageHeader
        title="Claude"
        description="An AI workspace grounded in your knowledge base, tickets, and docs."
      />
      <EmptyState
        icon={Sparkles}
        title="Claude assistant is coming"
        description="Chat with a model that knows your KB, your tickets, and your runbooks. Save sessions, share prompts, and pin answers to articles."
        hint="We'll start with a chat surface, then add tools for searching internal data."
      />
    </>
  );
}
