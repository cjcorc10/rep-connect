import { create } from "zustand";

export type Phase = "idle" | "animating" | "loading";

type State = {
  phase: Phase;
  targetHref: string;
  lastHref: string;
  transitionId: number;
  pageReady: boolean;
  animDone: boolean;
  pendingPush: (() => void) | null;

  navigate: (href: string, push: () => void) => void;
  coverComplete: () => void;
  markPageReady: () => void;
  loadingAnimComplete: () => void;
  syncHref: (href: string) => void;
};

function tryReady(
  get: () => State,
  set: (partial: Partial<State>) => void,
) {
  const { phase, pageReady, animDone } = get();
  if (phase === "loading" && pageReady && animDone) {
    set({
      phase: "idle",
      pageReady: false,
      animDone: false,
      pendingPush: null,
      lastHref: get().targetHref,
      targetHref: "",
    });
  }
}

export const usePageTransition = create<State>((set, get) => ({
  phase: "idle",
  targetHref: "",
  lastHref: "",
  transitionId: 0,
  pageReady: false,
  animDone: false,
  pendingPush: null,

  syncHref: (href) => {
    if (get().phase !== "idle") return;
    if (get().lastHref === href) return;
    set({ lastHref: href });
  },
  navigate: (href, push) => {
    if (get().phase !== "idle") return;

    set({
      phase: "animating",
      targetHref: href,
      pageReady: false,
      animDone: false,
      pendingPush: push,
    });
  },

  coverComplete: () => {
    const { phase, pendingPush, transitionId } = get();
    if (phase !== "animating") return;

    set({
      phase: "loading",
      transitionId: transitionId + 1,
      pendingPush: null,
    });
    pendingPush?.();
  },

  // loaded route is mounted and ready to enter
  markPageReady: () => {
    if (get().phase !== "loading") return;
    set({ pageReady: true });
    tryReady(get, set);
  },

  // loading logo animation complete and ready to reveal
  loadingAnimComplete: () => {
    if (get().phase !== "loading") return;
    set({ animDone: true });
    tryReady(get, set);
  },
}));

export function hrefMatches(pathname: string, targetHref: string) {
  if (!targetHref) return false;
  const path = targetHref.split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
