import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { LoginCard } from "@/components/auth/LoginCard";

export const metadata = { title: "Sign in · Atlas" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const entraEnabled = Boolean(
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
  );

  return (
    <main className="app-bg relative flex min-h-screen items-center justify-center px-6 py-12">
      <div className="relative z-10 w-full">
        <div className="mx-auto flex w-full justify-center">
          <LoginCard entraEnabled={entraEnabled} />
        </div>
      </div>
    </main>
  );
}
