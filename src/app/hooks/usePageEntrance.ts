"use client";

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
  const revealComplete = usePageTransition((s) => s.revealComplete);

  const isDestination =
    phase === "covered" && hrefMatches(pathname, targetHref);

  return {
    phase,
    targetHref,
    transitionId,
    isDestination,
    revealComplete,
    playEntrance: phase === "idle",
  };
}
