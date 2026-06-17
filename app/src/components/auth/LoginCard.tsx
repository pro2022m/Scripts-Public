"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FormValues {
  email: string;
  password: string;
}

export function LoginCard({ entraEnabled }: { entraEnabled: boolean }) {
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/dashboard";
  const errorParam = search.get("error");

  const [submitting, setSubmitting] = React.useState(false);
  const [oauthBusy, setOauthBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    errorParam ? "Sign-in failed. Please try again." : null,
  );

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setSubmitting(true);
    const res = await signIn("credentials", {
      ...values,
      redirect: true,
      callbackUrl,
    });
    setSubmitting(false);
    if (res && "error" in res && res.error) {
      setError("Invalid email or password.");
    }
  });

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <ShieldCheck className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to Atlas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Internal operations console
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur">
        {entraEnabled && (
          <>
            <Button
              variant="outline"
              className="h-11 w-full text-sm font-medium"
              disabled={oauthBusy}
              onClick={() => {
                setOauthBusy(true);
                void signIn("microsoft-entra-id", { callbackUrl });
              }}
            >
              {oauthBusy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MicrosoftLogo className="size-4" />
              )}
              Continue with Microsoft
            </Button>
            <div className="my-5 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                or
              </span>
              <Separator className="flex-1" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password", { required: true })}
            />
          </div>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="h-11 w-full" disabled={submitting || !formState.isValid}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Trouble signing in? Contact your administrator.
      </p>
    </div>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#F25022" d="M11.4 11.4H1V1h10.4z" />
      <path fill="#7FBA00" d="M23 11.4H12.6V1H23z" />
      <path fill="#00A4EF" d="M11.4 23H1V12.6h10.4z" />
      <path fill="#FFB900" d="M23 23H12.6V12.6H23z" />
    </svg>
  );
}
