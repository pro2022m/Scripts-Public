"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const LABEL_OVERRIDES: Record<string, string> = {
  dashboard: "Dashboard",
  freshdesk: "Freshdesk",
  claude: "Claude",
  "knowledge-base": "Knowledge Base",
  admin: "Admin",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
};

function humanize(seg: string) {
  return (
    LABEL_OVERRIDES[seg] ??
    seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  let acc = "";
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        acc += "/" + seg;
        const last = i === segments.length - 1;
        return (
          <div key={acc} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
            {last ? (
              <span className="font-medium text-foreground">{humanize(seg)}</span>
            ) : (
              <Link
                href={acc}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                )}
              >
                {humanize(seg)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
