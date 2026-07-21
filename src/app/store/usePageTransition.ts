import { create } from "zustand";

type State = {
  isExiting: boolean;
  isLoadingResults: boolean;
  isResultsReady: boolean;
  targetHref: string | null;
  startExit: (href: string) => void;
  markResultsReady: () => void;
  finishLoading: () => void;
  reset: () => void;
};

export const usePageTransition = create<State>((set) => ({
  isExiting: false,
  isLoadingResults: false,
  isResultsReady: false,
  targetHref: null,
  startExit: (href) =>
    set({
      isExiting: true,
      isLoadingResults: true,
      targetHref: href,
    }),
  markResultsReady: () => set({ isResultsReady: true }),
  finishLoading: () => set({ isLoadingResults: false }),
  reset: () =>
    set({
      isExiting: false,
      isLoadingResults: false,
      isResultsReady: false,
      targetHref: null,
    }),
}));
