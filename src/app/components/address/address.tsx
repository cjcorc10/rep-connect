"use client";
import { ArrowRight, Pencil } from "lucide-react";
import styles from "./address.module.css";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Address({ address }: { address: string }) {
  const [value, setValue] = useState(address);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
    router.push(`/reps/${value}`);
  };

  return (
    <div className={styles.addressContainer}>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.addressTitle}
            onClick={() => setEditing(true)}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          {editing ? (
            <SubmitButton />
          ) : (
            <EditButton setEditing={setEditing} />
          )}
        </div>
      </form>
    </div>
  );
}

const EditButton = ({
  setEditing,
}: {
  setEditing: (editing: boolean) => void;
}) => {
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
          <Pencil size={24} color="white" />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

const SubmitButton = () => {
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
};
