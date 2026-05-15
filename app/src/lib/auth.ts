import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "@node-rs/argon2";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getEffectiveAccess } from "@/lib/rbac";
import type { PermissionKey } from "@/lib/permissions";
import { authConfig as edgeAuthConfig } from "@/lib/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email & password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash || user.disabledAt) return null;

      const ok = await verify(user.passwordHash, password);
      if (!ok) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        image: user.image ?? null,
      };
    },
  }),
];

if (
  process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
  process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET &&
  process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID
) {
  providers.unshift(
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    }),
  );
}

export const authConfig = {
  ...edgeAuthConfig,
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    ...edgeAuthConfig.callbacks,
    async jwt({ token, user, trigger }) {
      // On sign-in or explicit refresh, recompute the effective permission set.
      if (user || trigger === "update") {
        const userId = (user?.id ?? token.sub) as string | undefined;
        if (userId) {
          const access = await getEffectiveAccess(userId);
          token.uid = userId;
          token.isOwner = access.isOwner;
          token.roles = access.roles;
          token.permissions = access.permissions;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid ?? token.sub ?? "") as string;
        session.user.isOwner = Boolean(token.isOwner);
        session.user.roles = (token.roles ?? []) as { key: string; name: string }[];
        session.user.permissions = (token.permissions ?? []) as PermissionKey[];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
