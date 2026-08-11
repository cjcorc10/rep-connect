import type { Phase } from "@/app/store/usePageTransition";

export const LOADER_ROUTES = ["/reps"];

export const TIMING = {
  wipeDuration: 0.8,
  wipeDelay: 0.15,
  holdDelay: 0.4,
  logoParkDuration: 1.2,
  loaderMinMs: 2500,
} as const;

export const EASE = {
  wipe: [0.65, 0, 0.35, 1] as const, // ease-in-out-cubic
  logo: [0.215, 0.61, 0.355, 1] as const, // ease-out-cubic
};

type WipeState = "hidden" | "covering" | "passed";

export type TransitionUI = {
  wipe: WipeState;
  hold: boolean;
  wipeDuration: number;
  wipeDelay: number;
  holdDelay: number;
};

export const TRANSITION_UI: Record<Phase, TransitionUI> = {
  idle: {
    wipe: "hidden",
    hold: false,
    wipeDuration: 0,
    wipeDelay: 0,
    holdDelay: 0,
  },
  animating: {
    wipe: "covering",
    hold: true,
    wipeDuration: TIMING.wipeDuration,
    wipeDelay: TIMING.wipeDelay,
    holdDelay: TIMING.holdDelay,
  },
  loading: {
    wipe: "passed",
    hold: true,
    wipeDuration: 0,
    wipeDelay: 0,
    holdDelay: 0,
  },
};

export const showLoader = (href: string): boolean => {
  if (!href) return false;
  const path = href.split("?")[0];
  return LOADER_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
};

export const wipeY = (wipe: WipeState): string => {
  return wipe === "hidden" ? "100%" : "-100%";
};
