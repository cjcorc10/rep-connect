"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  hrefMatches,
  usePageTransition,
} from "@/app/store/usePageTransition";

export function usePageEntrance() {
  const pathname = usePathname();
  const phase = usePageTransition((s) => s.phase);
  const targetHref = usePageTransition((s) => s.targetHref);
  const transitionId = usePageTransition((s) => s.transitionId);
  const markPageReady = usePageTransition((s) => s.markPageReady);

  const isDestination =
    phase === "loading" && hrefMatches(pathname, targetHref);

  const syncHref = usePageTransition((s) => s.syncHref);

  useEffect(() => {
    if (phase === "idle" && pathname) syncHref(pathname);
  }, [phase, pathname, syncHref]);
  useEffect(() => {
    if (isDestination) markPageReady();
  }, [isDestination, markPageReady]);

  return {
    phase,
    targetHref,
    transitionId,
    isDestination,
    isReady: phase === "idle",
    markReady: markPageReady,
  };
}
