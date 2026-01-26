"use client";
import styles from "./address.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import EditButton from "../button/editButton";
import SubmitButton from "../button/submitButton";
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

