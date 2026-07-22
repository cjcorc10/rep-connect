"use client";
import styles from "./loadingOverlay.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useAnimate } from "motion/react";
import { usePageTransition } from "@/app/store/usePageTransition";

export const LoadingOverlay = () => {
  const { pageReady, finishLoading, status } = usePageTransition();
  const isLoading = status === "loading" || !pageReady;
  const [scope, animate] = useAnimate();
  useEffect(() => {
    const run = async () => {
      const pathAnim = animate(
        "[data-animate='path-red']",
        {
          d: ["M 10 43 v 0", "M 10 43 v -18"],
        },
        {
          duration: 0.5,
          ease: "linear",
        },
      );
      const circleAnim = animate(
        "[data-animate='circle-red']",
        {
          strokeDasharray: ["0 100", "85 15"],
        },
        {
          delay: 0.5,
          duration: 0.5,
        },
      );
      await Promise.all([pathAnim, circleAnim]);
      while (!pageReady) {
        animate(
          "[data-animate='group-red']",
          {
            rotate: [0, 360],
          },
          {
            delay: 0.9,
            type: "spring",
            stiffness: 80,
            damping: 10,
            repeat: Infinity,
          },
        );
      }
      finishLoading();
    };
    run();
  }, [finishLoading, animate, pageReady]);
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ scale: 30 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={styles.loadingOverlay}
        >
          <div
            data-animate="container"
            className={styles.loadingOverlayContainer}
            ref={scope}
          >
            <LoadingLogo color={"red"} width={5} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoadingLogo = ({
  color,
  width,
}: {
  color: string;
  width: number;
}) => {
  let stroke = "white";
  if (color === "red") stroke = "var(--red-accent)";
  return (
    <svg className={styles.svgContainer} viewBox="0 0 50 50">
      <g data-animate={`group-${color}`}>
        <circle
          cx="25"
          cy="25"
          r="15"
          data-animate={`circle-${color}`}
          strokeWidth={width}
          pathLength="100"
          strokeDasharray="85 15"
          strokeDashoffset="-50"
          stroke={stroke}
        />
        <path
          d="M 10 43 v -18"
          data-animate={`path-${color}`}
          strokeWidth={width}
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset="0"
          stroke={stroke}
        />
      </g>
    </svg>
  );
};
