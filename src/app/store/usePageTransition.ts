import { create } from "zustand";

type State = {
  isExiting: boolean;
  targetHref: string | null;
  startExit: (href: string) => void;
  reset: () => void;
};

export const usePageTransition = create<State>((set) => ({
  isExiting: false,
  targetHref: null,
  startExit: (href) => set({ isExiting: true, targetHref: href }),
  reset: () => set({ isExiting: false, targetHref: null }),
}));
