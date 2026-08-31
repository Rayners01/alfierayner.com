"use client";

import { useCallback, useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
};

/**
 * Who is signed in, from the client's point of view.
 *
 * Only ever used to decide whether to *offer* the upload controls — the API
 * re-checks the session on every write, so a tampered client gains nothing but
 * a form that 401s.
 */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return { user, loading, refresh, signOut };
}
