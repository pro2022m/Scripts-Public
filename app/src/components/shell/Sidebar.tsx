import Link from "next/link";

import { hasAnyPermission, hasPermission } from "@/lib/rbac";
import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

import { BRAND, NAV_SECTIONS } from "./nav-config";
import { SidebarItem } from "./SidebarItem";

export async function Sidebar() {
  const session = await auth();
  const user = session?.user ?? null;
  const Icon = BRAND.icon;

  return (
    <aside
      className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur lg:flex"
      aria-label="Primary navigation"
    >
      {/* Brand */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 px-5 py-5 transition-opacity hover:opacity-90"
      >
        <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
          <Icon className="size-5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">{BRAND.name}</span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {BRAND.tagline}
          </span>
        </span>
      </Link>

      <Separator className="bg-sidebar-border" />

      {/* Sections */}
      <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => {
          if (section.anyPermission && !hasAnyPermission(user, section.anyPermission)) {
            return null;
          }
          const items = section.items.filter(
            (item) => !item.permission || hasPermission(user, item.permission),
          );
          if (items.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <SidebarItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={<ItemIcon className="size-[18px]" />}
                      badge={item.badge}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-5 py-4 text-[11px] text-muted-foreground">
        v0.1.0 ·{" "}
        <span className="text-primary">●</span>{" "}
        <span className="text-foreground/70">all systems normal</span>
      </div>
    </aside>
  );
}
