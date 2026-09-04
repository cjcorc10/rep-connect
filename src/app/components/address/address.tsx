"use client";
import styles from "./address.module.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type AddressProps = {
  address: string;
  open?: boolean;
};

export default function Address({
  address,
  open = true,
}: AddressProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!open) return;
    if (!value.trim()) return;
    router.push(`/reps/${value.trim()}`);
  };

  return (
    <div className={styles.addressContainer}>
      <div className={styles.addressContent}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              className={styles.addressTitle}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
              aria-label="ZIP code"
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className={styles.searchIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
