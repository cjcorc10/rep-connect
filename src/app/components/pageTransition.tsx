"use client";
import { ViewTransition } from "react";

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="slide-up" exit="none">
      {children}
    </ViewTransition>
  );
}

export default PageTransition;
