"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SubmitButton from "./button/submitButton";
import { BeautifulButton } from "./button/beautifulButton";

export default function SearchForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const FormSchema = z.object({
    zip: z
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .min(5),
  });

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(`/reps/${zip}`);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="w-full mx-auto px-8">
        <div className="flex gap-2 relative items-center">
          <label htmlFor="zip" className="sr-only">
            ZIP code
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Enter your ZIP code"
            required
            aria-invalid={error ? "true" : "false"}
            className="
              w-full
                block
                rounded-md
                px-4 py-1
                text-2xl
                bg-white text-gray-900 placeholder:text-gray-500
                outline-none
                ring-1 ring-gray-300 
              "
          />
          <input type="hidden" id="street" name="street" value="" />
          <BeautifulButton />
        </div>
      </form>

      {error && (
        <motion.div
          role="alert"
          className="text-sm sm:text-base text-center font-medium text-red-700 w-fit mx-auto absolute  bg-red-100/90 rounded-lg p-2"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          {error}
        </motion.div>
      )}
    </>
  );
}
