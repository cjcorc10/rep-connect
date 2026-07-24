"use client";
import { usePageTransition } from "@/app/store/usePageTransition";
import { motion } from "framer-motion";
import styles from "./exitTransition.module.scss";

export const ExitTransition = () => {
  const { completeExit, status } = usePageTransition();
  const trigger = status === "exiting";

  return (
    <div className={styles.transitionContainer}>
      <motion.div
        className={styles.transitionBackground}
        initial={{ opacity: 0 }}
        animate={trigger ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0 }}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={trigger ? { y: "-100%" } : { y: "100%" }}
        transition={{
          duration: trigger ? 0.6 : 0,
          ease: "easeInOut",
        }}
        className={styles.transitionBackground}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={trigger ? { y: "-100%" } : { y: "100%" }}
        className={styles.transitionBackground}
        transition={{
          duration: trigger ? 0.6 : 0,
          delay: 0.15,
          ease: "easeInOut",
        }}
        onAnimationComplete={() => {
          if (trigger) completeExit();
        }}
      />
    </div>
  );
};
