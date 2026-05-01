"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { BeautifulButton } from "../button/beautifulButton";
import styles from "./searchForm.module.scss";

const FormSchema = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/)
    .min(5),
});

export default function SearchForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
        <div role="alert" className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}
