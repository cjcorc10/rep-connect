"use client";
import styles from "./address.module.css";
import { useState, useEffect, useRef } from "react";
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
      <h1 className={styles.label}>Showing results for</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.addressTitle}
            onClick={() => setEditing(true)}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
        </div>
      </form>
    </div>
  );
}
