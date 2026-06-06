import { create } from "zustand";
import { Rep } from "../lib/definitions";

type State = {
  reps: Rep[];
};

type Action = {
  setReps: (newReps: State["reps"]) => void;
  getReps: () => Rep[];
  getRep: (bioguideId: string) => Rep | null;
};

export const useRepStore = create<State & Action>((set, get) => ({
  reps: [],
  setReps: (newReps) => set(() => ({ reps: newReps })),
  getReps: () => get().reps,
  getRep: (bioguideId) =>
    get().reps.find((rep) => rep.bioguide_id === bioguideId) ?? null,
}));
