"use client";
import { AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "@/app/components/loadingOverlay/loadingOverlay";
import { Suspense, useState } from "react";
import { usePageTransition } from "@/app/store/usePageTransition";

const DURATION = 1;

export const RepsPageShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const phase = usePageTransition((s) => s.phase);
  const targetHref = usePageTransition((s) => s.targetHref);
  const transitionId = usePageTransition((s) => s.transitionId);
  const revealComplete = usePageTransition((s) => s.revealComplete);

  const isDestination =
    phase === "covered" && targetHref.startsWith("/reps");

  const [coldPending, setColdPending] = useState(true);

  const shouldShow =
    isDestination || (phase === "idle" && coldPending);

  const onFinished = () => {
    if (isDestination) revealComplete();
    setColdPending(false);
  };

  return (
    <>
      <AnimatePresence>
        {shouldShow && (
          <LoadingOverlay
            key={`loading-overlay-${transitionId}`}
            duration={DURATION}
            onFinished={onFinished}
          />
        )}
      </AnimatePresence>
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
};
