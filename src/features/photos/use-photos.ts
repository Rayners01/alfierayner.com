"use client";

import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/photos.types";

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      if (!res.ok) throw new Error("Could not load the library");
      const data = await res.json();
      setPhotos(data.photos ?? []);
      setError(null);
    } catch {
      setError("Could not load the library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Inserts a newly uploaded photo without a round trip. */
  const add = useCallback((photo: Photo) => {
    setPhotos((current) => [photo, ...current]);
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
    if (res.ok) setPhotos((current) => current.filter((p) => p.id !== id));
    return res.ok;
  }, []);

  return { photos, loading, error, refresh, add, remove };
}
