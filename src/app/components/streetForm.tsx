'use client';
import { Search } from 'lucide-react';
import Button from './button';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';
import { useRouter } from 'next/navigation';

export default function StreetForm() {
  const { zip } = useParams();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const StreetSchema = z.object({
    street: z.string().min(1),
    zip: z.string().min(5),
  });

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

    router.push(`/reps/${zip}?street=${encodeURIComponent(street)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex bg-white rounded-2xl shadow-md px-4 py-2 mt-4 max-w-full"
    >
      <input type="hidden" name="zip" value={zip} />
      <input
        type="text"
        className="outline-none text-gray-800 text-md w-100"
        placeholder="Enter your street address (e.g., 191 Main St)"
        name="street"
        required
      />
      <Button>
        <Search />
      </Button>
      <p className="text-red-500">{error}</p>
    </form>
  );
}
