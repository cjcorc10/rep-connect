"use client";
import { usePageTransition } from "@/app/store/usePageTransition";
import { AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "@/app/components/loadingOverlay/loadingOverlay";
import { Suspense } from "react";

const DURATION = 1;
export const RepsPageShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status, pageReady } = usePageTransition();
  const shouldShow = status === "loading" || !pageReady;
  return (
    <>
      <AnimatePresence>
        {shouldShow && (
          <LoadingOverlay key="loading-overlay" duration={DURATION} />
        )}
      </AnimatePresence>
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
};
