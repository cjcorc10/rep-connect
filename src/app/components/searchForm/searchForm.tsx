"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { motion } from "framer-motion";
import { BeautifulButton } from "../button/beautifulButton";
import styles from "./searchForm.module.scss";

const FormSchema = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/)
    .min(5),
});

const PREFETCH_DEBOUNCE_MS = 300;

export default function SearchForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const prefetchTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const lastPrefetchedZipRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, []);

  function prefetchIfValidZip(raw: string) {
    const parsed = FormSchema.safeParse({ zip: raw });
    if (!parsed.success) {
      lastPrefetchedZipRef.current = null;
      return;
    }
    const { zip } = parsed.data;
    if (lastPrefetchedZipRef.current === zip) return;
    lastPrefetchedZipRef.current = zip;
    router.prefetch(`/reps/${zip}`);
  }

  const onZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current);
    }
    prefetchTimerRef.current = setTimeout(() => {
      prefetchTimerRef.current = null;
      prefetchIfValidZip(value);
    }, PREFETCH_DEBOUNCE_MS);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsedData = FormSchema.safeParse({
      zip: formData.get("zip"),
    });

    if (!parsedData.success) {
      setError("Please enter a valid ZIP code.");
      return;
    }

    const { zip } = parsedData.data;
    prefetchIfValidZip(zip);
    router.push(`/reps/${zip}`, {
      scroll: false,
      // transitionTypes: ["nav-forward"],
    });
  };

  return (
    <div className={styles.root}>
      <form onSubmit={onSubmit} className={styles.form}>
        <label htmlFor="zip" className={styles.srOnly}>
          ZIP code
        </label>
        <div className={styles.inputShell}>
          <input
            type="text"
            id="zip"
            name="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Enter your ZIP code"
            required
            aria-invalid={error ? "true" : "false"}
            className={styles.input}
            onChange={onZipChange}
          />
          <BeautifulButton
            content="SEARCH"
            compact
            className={styles.shellButton}
          />
        </div>
        <input type="hidden" id="street" name="street" value="" />
      </form>

      {error && (
        <motion.div
          role="alert"
          className={styles.error}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
