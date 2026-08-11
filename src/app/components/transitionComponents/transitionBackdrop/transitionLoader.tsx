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
      transform: "translate(-50%, -50%)",
    },
    resting: {
      top: 0,
      left: 0,
      transform: "translate(5%, 5%)",
      transition: park,
    },
  };
  const wrapperVariants = {
    loading: { height: "100%", width: "100%" },
    resting: {
      height: "30%",
      width: "30%",
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
        <CircleLogo setFinished={onFinished} variant={variant} />
      </motion.div>
    </motion.div>
  );
};
