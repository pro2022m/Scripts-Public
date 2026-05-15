import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Forbidden · Atlas" };

export default function ForbiddenPage() {
  return (
    <main className="app-bg relative grid min-h-screen place-items-center px-6">
      <div className="relative z-10 max-w-md text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn&apos;t have permission to view this page. If you think this is wrong,
          contact an administrator.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
