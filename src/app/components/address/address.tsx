"use client";
import styles from "./address.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
      <motion.div
        className={styles.addressContent}
        initial={{ opacity: 0, filter: "blur(7px)", y: 15 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <h1 className={styles.label}>Showing results for</h1>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <motion.input
              layoutId="address-title"
              ref={inputRef}
              className={styles.addressTitle}
              onClick={() => setEditing(true)}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
}
