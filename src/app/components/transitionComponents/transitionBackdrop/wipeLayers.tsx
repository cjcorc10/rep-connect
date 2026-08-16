"use client";

import { motion } from "framer-motion";
import styles from "./transitionBackdrop.module.scss";
import { EASE, wipeY, type TransitionUI } from "../transitionConfig";

type WipeLayersProps = {
  ui: TransitionUI;
  onCoverComplete: () => void;
  isCovering: boolean;
};

export const WipeLayers = ({
  ui,
  onCoverComplete,
  isCovering,
}: WipeLayersProps) => {
  const y = wipeY(ui.wipe);
  return (
    <>
      <motion.div
        className={styles.primaryWipe}
        initial={{ y: "100%" }}
        animate={{ y }}
        transition={{ duration: ui.wipeDuration, ease: EASE.wipe }}
      />
      <motion.div
        className={styles.secondaryWipe}
        initial={{ y: "100%" }}
        animate={{ y }}
        transition={{
          duration: ui.wipeDuration,
          ease: EASE.wipe,
          delay: ui.wipeDelay,
        }}
        onAnimationComplete={() => {
          if (isCovering) onCoverComplete();
        }}
      />
    </>
  );
};
