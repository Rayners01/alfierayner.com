"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Two-step delete: the first click arms it, the second carries it out. */
export function DeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!armed) {
      setArmed(true);
      return;
    }

    setBusy(true);
    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/blog");
      router.refresh();
    } else {
      setBusy(false);
      setArmed(false);
    }
  }

  return (
    <Button
      onClick={remove}
      onBlur={() => setArmed(false)}
      disabled={busy}
      className="px-3 py-1.5 text-sm"
    >
      {busy ? "Deleting…" : armed ? "Really delete?" : "Delete"}
    </Button>
  );
}
