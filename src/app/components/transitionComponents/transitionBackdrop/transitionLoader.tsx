"use client";

import { motion } from "framer-motion";
import styles from "./transitionBackdrop.module.scss";
import { CircleLogo } from "../ciricleLogo/circleLogo";

type TransitionLoaderProps = {
  onFinished: () => void;
};
export const TransitionLoader = ({
  onFinished,
}: TransitionLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.loaderContainer}
    >
      <div className={styles.loaderWrapper}>
        <CircleLogo setFinished={onFinished} />
      </div>
    </motion.div>
  );
};
