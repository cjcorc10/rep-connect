"use client";

import { motion } from "framer-motion";
import styles from "./transitionBackdrop.module.scss";
import { CircleLogo } from "../ciricleLogo/circleLogo";
import { EASE, TIMING } from "../transitionConfig";
import { usePageTransition } from "@/app/store/usePageTransition";
import { useRouter } from "next/navigation";

type TransitionLoaderProps = {
  onFinished: () => void;
  variant: "loading" | "resting";
};
export const TransitionLoader = ({
  variant,
  onFinished,
}: TransitionLoaderProps) => {
  const park = {
    duration: TIMING.logoParkDuration,
    ease: EASE.logo,
  };

  const navigate = usePageTransition((state) => state.navigate);
  const router = useRouter();
  const containerVariants = {
    loading: {
      opacity: [0, 1],
      top: "50%",
      left: "50%",
      x: "-50%",
      y: "-50%",
    },
    resting: {
      top: 0,
      left: "50%",
      x: "-50%",
      y: 0,
      transition: park,
      scale: 0.3,
      transformOrigin: "top",
    },
  };
  const wrapperVariants = {
    loading: { height: "100%", width: "100%" },
    resting: {
      transition: park,
      pointerEvents: "auto",
      cursor: "pointer",
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial={false}
      animate={variant}
      className={styles.loaderContainer}
    >
      <motion.div
        variants={wrapperVariants}
        initial={false}
        animate={variant}
        className={styles.loaderWrapper}
        onClick={() => navigate("/", () => router.push("/"))}
      >
        <CircleLogo setFinished={onFinished} />
      </motion.div>
    </motion.div>
  );
};
