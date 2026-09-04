"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export function AuthLink({
  signedIn,
  onSignedOut,
  className,
}: {
  signedIn: boolean;
  onSignedOut?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const style = cn("underline hover:text-accent", className);

  if (!signedIn) {
    return (
      <NextLink href="/login" className={style}>
        Sign in
      </NextLink>
    );
  }

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      onSignedOut?.();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={signOut} disabled={busy} className={style}>
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
