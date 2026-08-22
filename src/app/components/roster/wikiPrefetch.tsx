"use client";

import { useEffect } from "react";
import { prefetchWikipedia } from "@/app/hooks/useWikipedia";

type WikiPrefetchProps = { ids: string[] };

/** Warms the shared Wikipedia cache so row detail bios are ready on accordion open. */
export function WikiPrefetch({ ids }: WikiPrefetchProps) {
  const unique = [...new Set(ids.filter(Boolean))];

  useEffect(() => {
    unique.forEach((id) => prefetchWikipedia(id));
  }, [unique.join("|")]);

  return null;
}
