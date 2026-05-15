"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export function SidebarItem({ href, label, icon: Icon, badge }: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground",
        active &&
          "bg-sidebar-accent text-foreground shadow-sm before:absolute before:left-0 before:top-1.5 before:h-[calc(100%-12px)] before:w-[3px] before:rounded-full before:bg-primary",
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <Badge variant="muted" className="text-[10px] uppercase tracking-wide">
          {badge}
        </Badge>
      )}
    </Link>
  );
}
