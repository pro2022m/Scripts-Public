/**
 * Single source of truth for every permission in the system.
 *
 * Convention: <area>.<resource>.<action>
 *
 * The seed mirrors this list into the `Permission` table so the admin UI can
 * render it and the DB can FK against it. Adding a new permission is a two
 * step process: add it here, then run `pnpm db:seed`.
 */

export type PermissionKey =
  | "dashboard.view"
  | "freshdesk.tickets.read"
  | "freshdesk.tickets.write"
  | "claude.chat.use"
  | "claude.chat.admin"
  | "kb.articles.read"
  | "kb.articles.write"
  | "kb.articles.publish"
  | "admin.users.read"
  | "admin.users.manage"
  | "admin.roles.read"
  | "admin.roles.manage"
  | "admin.permissions.read"
  | "admin.permissions.manage";

export interface PermissionDef {
  key: PermissionKey;
  area: string;
  resource: string;
  action: string;
  description: string;
}

export const PERMISSIONS: readonly PermissionDef[] = [
  // Dashboard
  {
    key: "dashboard.view",
    area: "dashboard",
    resource: "dashboard",
    action: "view",
    description: "View the main dashboard.",
  },

  // Freshdesk
  {
    key: "freshdesk.tickets.read",
    area: "freshdesk",
    resource: "tickets",
    action: "read",
    description: "View Freshdesk tickets.",
  },
  {
    key: "freshdesk.tickets.write",
    area: "freshdesk",
    resource: "tickets",
    action: "write",
    description: "Create, update, or reply to Freshdesk tickets.",
  },

  // Claude
  {
    key: "claude.chat.use",
    area: "claude",
    resource: "chat",
    action: "use",
    description: "Start and continue Claude chat sessions.",
  },
  {
    key: "claude.chat.admin",
    area: "claude",
    resource: "chat",
    action: "admin",
    description: "Manage Claude prompts, models, and shared sessions.",
  },

  // Knowledge Base
  {
    key: "kb.articles.read",
    area: "kb",
    resource: "articles",
    action: "read",
    description: "Read knowledge base articles.",
  },
  {
    key: "kb.articles.write",
    area: "kb",
    resource: "articles",
    action: "write",
    description: "Create and edit knowledge base drafts.",
  },
  {
    key: "kb.articles.publish",
    area: "kb",
    resource: "articles",
    action: "publish",
    description: "Publish or unpublish knowledge base articles.",
  },

  // Admin
  {
    key: "admin.users.read",
    area: "admin",
    resource: "users",
    action: "read",
    description: "View users.",
  },
  {
    key: "admin.users.manage",
    area: "admin",
    resource: "users",
    action: "manage",
    description: "Create, update, disable, and assign roles to users.",
  },
  {
    key: "admin.roles.read",
    area: "admin",
    resource: "roles",
    action: "read",
    description: "View roles.",
  },
  {
    key: "admin.roles.manage",
    area: "admin",
    resource: "roles",
    action: "manage",
    description: "Create, update, and delete roles, including their permission sets.",
  },
  {
    key: "admin.permissions.read",
    area: "admin",
    resource: "permissions",
    action: "read",
    description: "View the permission catalog.",
  },
  {
    key: "admin.permissions.manage",
    area: "admin",
    resource: "permissions",
    action: "manage",
    description: "Apply per-user permission grants and denies.",
  },
] as const;

export const ALL_PERMISSION_KEYS: readonly PermissionKey[] = PERMISSIONS.map((p) => p.key);

/**
 * Built-in roles. Seeded once and marked as system so they cannot be deleted.
 * The Owner role is implicit (User.isOwner = true) and is not stored here.
 */
export const SYSTEM_ROLES: ReadonlyArray<{
  key: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
}> = [
  {
    key: "admin",
    name: "Admin",
    description: "Full access to every feature and the admin area.",
    permissions: [...ALL_PERMISSION_KEYS],
  },
  {
    key: "editor",
    name: "Editor",
    description: "Read everywhere; write across Freshdesk, Claude, and the knowledge base.",
    permissions: [
      "dashboard.view",
      "freshdesk.tickets.read",
      "freshdesk.tickets.write",
      "claude.chat.use",
      "kb.articles.read",
      "kb.articles.write",
    ],
  },
  {
    key: "viewer",
    name: "Viewer",
    description: "Read-only access to feature areas.",
    permissions: [
      "dashboard.view",
      "freshdesk.tickets.read",
      "claude.chat.use",
      "kb.articles.read",
    ],
  },
];

/** Permissions grouped by area, useful for the admin UI. */
export function permissionsByArea(): Record<string, PermissionDef[]> {
  return PERMISSIONS.reduce<Record<string, PermissionDef[]>>((acc, p) => {
    (acc[p.area] ??= []).push(p);
    return acc;
  }, {});
}
