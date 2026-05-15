import type { LucideIcon } from "lucide-react";
import {
  BookText,
  LayoutDashboard,
  LifeBuoy,
  Shield,
  ShieldCheck,
  Sparkles,
  Users2,
  KeyRound,
} from "lucide-react";

import type { PermissionKey } from "@/lib/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: PermissionKey;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  /** If set, the entire section is hidden unless the user has any of these perms. */
  anyPermission?: PermissionKey[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
      {
        label: "Freshdesk",
        href: "/freshdesk",
        icon: LifeBuoy,
        permission: "freshdesk.tickets.read",
        badge: "Soon",
      },
      {
        label: "Claude",
        href: "/claude",
        icon: Sparkles,
        permission: "claude.chat.use",
        badge: "Soon",
      },
      {
        label: "Knowledge Base",
        href: "/knowledge-base",
        icon: BookText,
        permission: "kb.articles.read",
        badge: "Soon",
      },
    ],
  },
  {
    title: "Admin",
    anyPermission: [
      "admin.users.read",
      "admin.users.manage",
      "admin.roles.read",
      "admin.roles.manage",
      "admin.permissions.read",
      "admin.permissions.manage",
    ],
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: Users2,
        permission: "admin.users.read",
      },
      {
        label: "Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
        permission: "admin.roles.read",
      },
      {
        label: "Permissions",
        href: "/admin/permissions",
        icon: KeyRound,
        permission: "admin.permissions.read",
      },
    ],
  },
];

export const BRAND = {
  name: "Atlas",
  tagline: "Internal Console",
  icon: Shield,
} as const;
