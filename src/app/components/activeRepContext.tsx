"use client";
import { createContext, useContext, ReactNode } from "react";
import { Rep } from "../lib/definitions";

type ActiveRepContextType = {
  activeRep: Rep | null;
  setActiveRep: (rep: Rep | null) => void;
};

const ActiveRepContext = createContext<
  ActiveRepContextType | undefined
>(undefined);

export function ActiveRepProvider({
  children,
  activeRep,
  setActiveRep,
}: {
  children: ReactNode;
  activeRep: Rep | null;
  setActiveRep: (rep: Rep | null) => void;
}) {
  return (
    <ActiveRepContext.Provider
      value={{ activeRep, setActiveRep }}
    >
      {children}
    </ActiveRepContext.Provider>
  );
}

export function useActiveRep() {
  const context = useContext(ActiveRepContext);
  if (context === undefined) {
    throw new Error(
      "useActiveRep must be used within an ActiveRepProvider"
    );
  }
  return context;
}
