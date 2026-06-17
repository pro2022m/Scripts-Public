import type { DefaultSession } from "next-auth";
import type { PermissionKey } from "@/lib/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOwner: boolean;
      roles: { key: string; name: string }[];
      permissions: PermissionKey[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    isOwner?: boolean;
    roles?: { key: string; name: string }[];
    permissions?: PermissionKey[];
  }
}
