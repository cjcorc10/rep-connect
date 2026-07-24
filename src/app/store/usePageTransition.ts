import { create } from "zustand";

/** Called by the animating client when an exit/entrance animation finishes. */
type AnimationResolve = () => void;

type State = {
  status: "idle" | "loading" | "exiting";
  pageReady: boolean;
  exitResolver: AnimationResolve | null;
  entranceResolver: AnimationResolve | null;
  completeExit: () => void;
  completeEntrance: () => void;

  setPageReady: (ready: boolean) => void;
  setExiting: (resolver: AnimationResolve) => void;
  setLoading: (resolver: AnimationResolve) => void;
  reset: () => void;
  triggerPageTransition: (routerAction: () => void) => void;
};

export const usePageTransition = create<State>((set, get) => ({
  status: "idle",
  pageReady: false,
  exitResolver: null,
  entranceResolver: null,
  completeExit: () => {
    const { exitResolver } = get();

    if (exitResolver) exitResolver();
    set({ exitResolver: null });
  },
  completeEntrance: () => {
    const { entranceResolver } = get();
    if (entranceResolver) entranceResolver();
    set({ entranceResolver: null, status: "idle" });
  },
  setPageReady: (ready) => set({ pageReady: ready }),
  setExiting: (resolver) =>
    set({ status: "exiting", exitResolver: resolver }),
  setLoading: (resolver) =>
    set({ status: "loading", entranceResolver: resolver }),
  reset: () => set({ status: "idle" }),

  triggerPageTransition: async (routerAction: () => void) => {
    const { setExiting, setLoading } = get();

    const exitAnimation = new Promise<void>((resolve) =>
      setExiting(resolve),
    );
    await exitAnimation;

    routerAction();
    const entranceAnimation = new Promise<void>((resolve) =>
      setLoading(resolve),
    );
    await entranceAnimation;
  },
}));
