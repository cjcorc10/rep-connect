"use client";

import { motion } from "framer-motion";
import styles from "./transitionBackdrop.module.scss";
import type { TransitionUI } from "../transitionConfig";

export const HoldLayer = ({ ui }: { ui: TransitionUI }) => {
  return (
    <motion.div
      className={styles.holdLayer}
      initial={{ opacity: 0 }}
      animate={{ opacity: ui.hold ? 1 : 0 }}
      transition={{ delay: ui.holdDelay, duration: 0 }}
    />
  );
};
