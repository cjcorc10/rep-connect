"use client";
import { usePageTransition } from "@/app/store/usePageTransition";
import React, { useState } from "react";
import z from "zod";
import styles from "./searchForm.module.scss";
import SubmitButton from "../button/submitButton";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/)
    .min(5),
});

export default function SearchForm() {
  const router = useRouter();
  const navigate = usePageTransition((s) => s.navigate);
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
    const href = `/reps/${zip}`;
    navigate(href, () => router.push(href));
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
          <SubmitButton />
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
