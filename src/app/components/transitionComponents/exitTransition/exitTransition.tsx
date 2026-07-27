"use client";
import { usePageTransition } from "@/app/store/usePageTransition";
import { motion } from "framer-motion";
import styles from "./exitTransition.module.scss";

export const ExitTransition = () => {
  const phase = usePageTransition((s) => s.phase);
  const coverComplete = usePageTransition((s) => s.coverComplete);

  const holdUp = phase === "covering" || phase === "covered";
  const wipeActive = phase !== "idle";

  return (
    <div className={styles.transitionContainer}>
      <motion.div
        className={styles.transitionBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: holdUp ? 1 : 0 }}
        transition={{
          delay: holdUp ? 0.4 : 0,
          duration: 0,
        }}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={wipeActive ? { y: "-100%" } : { y: "100%" }}
        transition={{
          duration: phase === "covering" ? 0.6 : 0,
          ease: "easeInOut",
        }}
        className={styles.transitionBackground}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={wipeActive ? { y: "-100%" } : { y: "100%" }}
        className={styles.transitionBackground}
        transition={{
          duration: phase === "covering" ? 0.6 : 0,
          delay: phase === "covering" ? 0.15 : 0,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          if (phase === "covering") coverComplete();
        }}
      />
    </div>
  );
};
