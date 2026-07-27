"use client";
import styles from "./loadingOverlay.module.scss";
import { motion } from "framer-motion";

const exitAnimationConfig = {
  initial: { opacity: 1, scale: 1 },
  exit: { scale: 35 },
  transition: { duration: 0.7, ease: "easeInOut" as const },
};

export const LoadingOverlay = ({
  duration,
  onFinished,
}: {
  duration: number;
  onFinished: () => void;
}) => {
  return (
    <motion.div
      initial={exitAnimationConfig.initial}
      exit={exitAnimationConfig.exit}
      transition={exitAnimationConfig.transition}
      className={styles.loadingOverlay}
    >
      <div
        data-animate="container"
        className={styles.loadingOverlayContainer}
      >
        <LoadingLogo duration={duration} setFinished={onFinished} />
      </div>
    </motion.div>
  );
};

const LoadingLogo = ({
  duration,
  setFinished,
}: {
  duration: number;
  setFinished: () => void;
}) => {
  return (
    <svg className={styles.svgContainer} viewBox="0 0 50 50">
      <g data-animate="group">
        <motion.circle
          cx="25"
          cy="25"
          r="15"
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray: ["0 100", "0 100", "85 15"] }}
          transition={{
            duration: duration,
            ease: "easeOut" as const,
            times: [0, 0.25, 1],
          }}
          onAnimationComplete={() => setFinished()}
          pathLength="100"
          strokeDashoffset="-50"
          strokeWidth="5"
        />
        <motion.path
          d="M 10 43 v -19"
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray: ["0 100", "100 0"] }}
          transition={{
            duration: duration,
            ease: "easeIn" as const,
            times: [0, 0.25],
          }}
          pathLength="100"
          strokeDasharray="100"
          strokeWidth="5"
        />
      </g>
    </svg>
  );
};
