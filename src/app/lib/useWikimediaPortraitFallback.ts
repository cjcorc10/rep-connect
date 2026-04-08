"use client";

import { useEffect, useState } from "react";
import { isWikimediaImageHost } from "./portraitImage";

/**
 * Prefer next/image optimization for Wikimedia (better quality). If the optimizer
 * fails (e.g. upstream 429), flip to unoptimized so the browser loads the URL directly.
 */
export function useWikimediaPortraitFallback(src: string) {
  const wikimedia = isWikimediaImageHost(src);
  const [optimizerFailed, setOptimizerFailed] = useState(false);

  useEffect(() => {
    setOptimizerFailed(false);
  }, [src]);

  return {
    unoptimized: wikimedia && optimizerFailed,
    onError: () => {
      if (wikimedia && !optimizerFailed) setOptimizerFailed(true);
    },
    /** Force a fresh mount when switching to direct load after an error. */
    remountKey: `${src}__${wikimedia && optimizerFailed ? "d" : "o"}`,
  };
}
