"use client";
import { useEffect } from "react";
import { usePageTransition } from "@/app/store/usePageTransition";
import styles from "./transitionBackdrop.module.scss";
import { HoldLayer } from "./holdLayer";
import { showLoader, TRANSITION_UI } from "../transitionConfig";
import { WipeLayers } from "./wipeLayers";
import { TransitionLoader } from "./transitionLoader";

export const TransitionBackdrop = () => {
  const phase = usePageTransition((state) => state.phase);
  const targetHref = usePageTransition((state) => state.targetHref);
  const lastHref = usePageTransition((state) => state.lastHref);
  const coverComplete = usePageTransition(
    (state) => state.coverComplete,
  );
  const loadingAnimComplete = usePageTransition(
    (state) => state.loadingAnimComplete,
  );
  const ui = TRANSITION_UI[phase];
  const loaderHref = phase == "idle" ? lastHref : targetHref;
  const loaderVisible = phase === "loading" && showLoader(loaderHref);

  useEffect(() => {
    if (phase === "loading" && !loaderVisible) loadingAnimComplete();
  }, [phase, loaderVisible, loadingAnimComplete]);

  return (
    <div className={styles.root}>
      <HoldLayer ui={ui} />
      <WipeLayers
        ui={ui}
        isCovering={phase === "animating"}
        onCoverComplete={coverComplete}
      />
      {loaderVisible && (
        <TransitionLoader onFinished={loadingAnimComplete} />
      )}
    </div>
  );
};
