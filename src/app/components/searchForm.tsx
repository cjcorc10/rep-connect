'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import z from 'zod';
import Button from './button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

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
      zip: formData.get('zip'),
    });

    if (!parsedData.success) {
      setError('Please enter a valid ZIP code.');
      return;
    }

    const { zip } = parsedData.data;
    router.push(`/reps/${zip}`);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="
          w-full max-w-[720px] mx-auto
          bg-white/95 backdrop-blur
          rounded-xl shadow-md
          p-2
        "
      >
        <div className="flex items-stretch gap-2">
          <div className="flex-1 min-w-0">
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
              aria-invalid={error ? 'true' : 'false'}
              className="
                block w-full
                rounded-lg
                px-4 py-3
                text-base sm:text-lg
                bg-white text-gray-900 placeholder:text-gray-500
                outline-none
                ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-600
              "
            />
            <input type="hidden" id="street" name="street" value="" />
          </div>

          <Button>
            <Search className="mr-2" />
            Search
          </Button>
        </div>
      </form>

      {error && (
        <motion.div
          role="alert"
          className="mt-3 text-sm sm:text-base font-medium text-red-700  bg-red-100/90 rounded-lg p-1 w-fit"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </>
  );
}
