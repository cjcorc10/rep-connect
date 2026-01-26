"use client";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./submitButton.module.css";

export default function SubmitButton() {
  return (
    <div className={styles.submitButtonWrapper}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className={styles.submitButton}
        layoutId="button"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence>
          <motion.div
            initial={{ filter: "blur(4px)" }}
            animate={{ filter: "blur(0)" }}
            exit={{ filter: "blur(4px)" }}
            transition={{ duration: 0.5 }}
          >
            <ArrowRight size={48} color="white" />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}