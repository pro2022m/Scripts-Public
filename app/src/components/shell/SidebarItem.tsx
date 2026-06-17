"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export function SidebarItem({ href, label, icon, badge }: Props) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      data-active={active || undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground",
        "data-[active]:bg-sidebar-accent data-[active]:text-foreground data-[active]:shadow-sm",
        "data-[active]:before:absolute data-[active]:before:left-0 data-[active]:before:top-1.5",
        "data-[active]:before:h-[calc(100%-12px)] data-[active]:before:w-[3px]",
        "data-[active]:before:rounded-full data-[active]:before:bg-primary",
      )}
    >
      <span
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center transition-colors",
          "text-muted-foreground group-hover:text-foreground",
          active && "text-primary group-hover:text-primary",
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <Badge variant="muted" className="text-[10px] uppercase tracking-wide">
          {badge}
        </Badge>
      )}
    </Link>
  );
}
