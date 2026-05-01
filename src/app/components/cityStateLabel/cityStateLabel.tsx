"use client";
import { motion } from "framer-motion";
import styles from "./cityStateLabel.module.css";

type Props = {
  label: string;
};

export default function CityStateLabel({ label }: Props) {
  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, filter: "blur(7px)", y: 15 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {label}
      </motion.h1>
    </div>
  );
}
