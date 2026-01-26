'use client';
import { ArrowRight, Loader, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import z from 'zod';
import { motion } from 'framer-motion';
import SubmitButton from "./button/submitButton";

const StreetSchema = z.object({
  street: z.string().min(1),
  zip: z.string().min(5),
});

export default function StreetForm({
  refine,
}: {
  refine: (street: string, zip: string) => Promise<boolean>;
}) {
  const { zip } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsedData = StreetSchema.safeParse({
      street: formData.get('street'),
      zip: formData.get('zip'),
    });

    if (!parsedData.success) {
      setError('Please enter a valid street address.');
      return;
    }
    const { street, zip } = parsedData.data;
    setLoading(true);
    const res = await refine(street, zip);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
    if (!res) setError('District not refined. Please try again.');
    else setError(null);
  };

  return (
    <>
      <motion.form
        onSubmit={onSubmit}
        className="flex bg-gray-100 rounded-lg shadow-md px-4 py-2 max-w-full relative items-center"
      >
        <input type="hidden" name="zip" value={zip} />
        <input
          type="text"
          ref={inputRef}
          className="outline-none text-black text-lg w-100"
          placeholder="Enter your street address (e.g., 191 Main St)"
          name="street"
          required
        />
          <button className="absolute right-1 bg-black rounded-lg p-1 px-2 active:scale-95">
        {!loading ? (
            <ArrowRight color="white"/>
            
          ) : (
            <Loader color="white" className="animate-spin" />
          )}
          </button>
      </motion.form>
      <p className="text-red-500 font-bold text-sm pt-4">{error}</p>
    </>
  );
}
