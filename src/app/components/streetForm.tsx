'use client';
import { Loader, Search } from 'lucide-react';
import Button from './button';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import z from 'zod';
import { motion } from 'framer-motion';

const StreetSchema = z.object({
  street: z.string().min(1),
  zip: z.string().min(5),
});

export default function StreetForm({
  refine,
}: {
  refine: (street: string, zip: string) => void;
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
    await refine(street, zip);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      className="flex bg-white rounded-2xl shadow-md px-4 py-2 mt-4 max-w-full"
    >
      <input type="hidden" name="zip" value={zip} />
      <input
        type="text"
        ref={inputRef}
        className="outline-none text-gray-800 text-md w-100"
        placeholder="Enter your street address (e.g., 191 Main St)"
        name="street"
        required
      />
      <Button>
        {loading ? <Loader className="animate-spin" /> : <Search />}
      </Button>
      <p className="text-red-500">{error}</p>
    </motion.form>
  );
}
