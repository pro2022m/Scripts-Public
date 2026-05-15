import { Search } from "lucide-react";

import { auth } from "@/lib/auth";
import { Input } from "@/components/ui/input";

import { Breadcrumbs } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export async function TopBar() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/70 bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Breadcrumbs />
      </div>

      <div className="hidden items-center md:flex">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-9 w-64 pl-8 text-sm"
            disabled
            aria-label="Global search (coming soon)"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu
          name={user.name ?? null}
          email={user.email ?? ""}
          image={user.image ?? null}
          isOwner={user.isOwner}
          roleLabels={user.roles?.map((r) => r.name) ?? []}
        />
      </div>
    </header>
  );
}
