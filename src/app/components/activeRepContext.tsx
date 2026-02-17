"use client";
import { createContext, useContext, ReactNode } from "react";
import { Rep } from "../lib/definitions";

type ActiveRepContextType = {
  activeRep: Rep | null;
  setActiveRep: (rep: Rep | null) => void;
  selectedReps: Rep[];
  setSelectedReps: (reps: Rep[] | ((prev: Rep[]) => Rep[])) => void;
};

const ActiveRepContext = createContext<
  ActiveRepContextType | undefined
>(undefined);

export function ActiveRepProvider({
  children,
  activeRep,
  setActiveRep,
  selectedReps,
  setSelectedReps,
}: {
  children: ReactNode;
  activeRep: Rep | null;
  setActiveRep: (rep: Rep | null) => void;
  selectedReps: Rep[];
  setSelectedReps: (reps: Rep[] | ((prev: Rep[]) => Rep[])) => void;
}) {
  return (
    <ActiveRepContext.Provider
      value={{
        activeRep,
        setActiveRep,
        selectedReps,
        setSelectedReps,
      }}
    >
      {children}
    </ActiveRepContext.Provider>
  );
}

export function useActiveRep() {
  const context = useContext(ActiveRepContext);
  if (context === undefined) {
    throw new Error(
      "useActiveRep must be used within an ActiveRepProvider",
    );
  }
  return context;
}
