import { create } from "zustand";

type Resolve = () => void;

type Phase = "idle" | "covering" | "covered";

type State = {
  phase: Phase;
  targetHref: string;
  transitionId: number;
  coverResolver: Resolve | null;
  revealResolver: Resolve | null;

  coverComplete: () => void;
  revealComplete: () => void;

  navigate: (href: string, push: () => void) => Promise<void>;
};

export const usePageTransition = create<State>((set, get) => ({
  phase: "idle",
  targetHref: "",
  transitionId: 0,
  coverResolver: null,
  revealResolver: null,

  coverComplete: () => {
    const { coverResolver, phase } = get();
    if (phase !== "covering" || !coverResolver) return;
    coverResolver();
    set({ coverResolver: null });
  },

  revealComplete: () => {
    const { revealResolver, phase } = get();
    if (phase !== "covered" || !revealResolver) return;
    revealResolver();
    set({
      revealResolver: null,
      phase: "idle",
      targetHref: "",
    });
  },

  navigate: async (href, push) => {
    if (get().phase !== "idle") return;

    // Do not bump transitionId here — source pages key Motion on it;
    // bumping at cover start remounts them to `initial` and blinks.
    set({
      phase: "covering",
      targetHref: href,
    });

    await new Promise<void>((resolve) => {
      set({ coverResolver: resolve });
    });

    push();
    set({
      phase: "covered",
      transitionId: get().transitionId + 1,
    });

    await new Promise<void>((resolve) => {
      set({ revealResolver: resolve });
    });
  },
}));

/** Whether the current location is the in-flight transition destination. */
export function hrefMatches(pathname: string, targetHref: string) {
  if (!targetHref) return false;
  const path = targetHref.split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
