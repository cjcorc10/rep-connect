"use client";
import { Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./editButton.module.css";

type EditButtonProps = {
  setEditing: (editing: boolean) => void;
};

export default function EditButton({ setEditing }: EditButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className={styles.editButton}
      layoutId="button"
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ filter: "blur(4px)" }}
          animate={{ filter: "blur(0)" }}
          exit={{ filter: "blur(4px)" }}
        >
          <Pencil size={24} color="black" />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
