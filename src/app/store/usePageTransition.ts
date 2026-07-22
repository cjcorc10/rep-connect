import { create } from "zustand";

type State = {
  status: "idle" | "loading" | "exiting";
  pageReady: boolean;
  targetHref: string | null;
  setPageReady: (ready: boolean) => void;
  startExit: (href: string) => void;
  enterLoading: () => void;
  finishLoading: () => void;
  reset: () => void;
};

export const usePageTransition = create<State>((set) => ({
  status: "idle",
  pageReady: false,
  targetHref: null,
  setPageReady: (ready) => set({ pageReady: ready }),
  startExit: (href) => set({ targetHref: href }),
  enterLoading: () => set({ status: "loading" }),
  finishLoading: () => set({ status: "idle" }),
  reset: () => set({ status: "idle", targetHref: null }),
}));
