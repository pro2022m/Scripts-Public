"use client";

import { signOut } from "next-auth/react";
import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  name: string | null;
  email: string;
  image: string | null;
  isOwner: boolean;
  roleLabels: string[];
}

function initials(name: string | null, email: string) {
  const source = (name ?? email).trim();
  const parts = source.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function UserMenu({ name, email, image, isOwner, roleLabels }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 p-1 pr-3 text-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open user menu"
        >
          <Avatar className="size-7">
            {image ? <AvatarImage src={image} alt={name ?? email} /> : null}
            <AvatarFallback>{initials(name, email)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline">{name ?? email}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2 normal-case">
          <Avatar className="size-9">
            {image ? <AvatarImage src={image} alt={name ?? email} /> : null}
            <AvatarFallback>{initials(name, email)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold text-foreground">
              {name ?? "Unnamed user"}
            </span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <div className="flex flex-wrap gap-1 px-2 pb-2">
          {isOwner && (
            <Badge variant="purple" className="gap-1">
              <ShieldCheck className="size-3" /> Owner
            </Badge>
          )}
          {roleLabels.map((r) => (
            <Badge key={r} variant="default">
              {r}
            </Badge>
          ))}
          {!isOwner && roleLabels.length === 0 && (
            <Badge variant="muted">No roles assigned</Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserCircle2 className="mr-2 size-4" /> Account settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void signOut({ callbackUrl: "/login" });
          }}
        >
          <LogOut className="mr-2 size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
