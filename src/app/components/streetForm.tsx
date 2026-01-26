'use client';
import { ArrowRight, Loader, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

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
    
    // Block further actions if already loading
    if (loading) return;
    
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
    
    // Block for 3 seconds before allowing refinement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const res = await refine(street, zip);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
    if (!res) setError('District not refined. Please try again.');
    else setError(null);
  };

  return (
    <>
      <motion.form
      layoutId="refine-wrapper"
        onSubmit={onSubmit}
        className="flex border rounded-lg px-2 relative h-full"
      >
        <input type="hidden" name="zip" value={zip} />
        <div className="absolute top-0 py-1 text-gray-500 text-lg">
        </div>
        <input
          type="text"
          ref={inputRef}
          className="outline-none text-black text-lg w-full py-1 absolute top-0"
          placeholder="Enter your address"
          name="street"
          required
        />
          <motion.button initial={{opacity: 0, filter: 'blur(7px)'}} animate={{opacity: 1, filter: 'blur(0px)'}} className="bg-black rounded-lg w-[70px] h-[35px] active:scale-95 absolute right-[2%] bottom-[5%] overflow-hidden">
            <AnimatePresence mode="popLayout">

        {!loading ? (
          <motion.p layoutId="refine-text" key="refine" exit={{y: 50}} className="text-white">refine</motion.p>
        ) : (
          <motion.div className="w-full flex items-center justify-center" key="loading" initial={{y: -50}} animate={{y: 0}} transition={{ease: 'easeOut'}}>

            <Loader color="white" className="animate-spin" />
            </motion.div>
          )}
          </AnimatePresence>
          </motion.button>
      </motion.form>
    </>
  );
}
