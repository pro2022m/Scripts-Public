import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config used by `middleware.ts`.
 *
 * It must NOT import anything that pulls in Prisma, Argon2, or other Node-only
 * modules — middleware runs on the Edge runtime. The full config (with
 * providers, adapter, callbacks that hit the DB) lives in `lib/auth.ts`.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth }) {
      // We do route-level redirects in middleware itself; just signal whether
      // a session exists.
      return Boolean(auth?.user);
    },
  },
} satisfies NextAuthConfig;
