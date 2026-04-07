"use client";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import z from "zod";
import { AnimatePresence, motion } from "framer-motion";

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
  const [, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Block further actions if already loading
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const parsedData = StreetSchema.safeParse({
      street: formData.get("street"),
      zip: formData.get("zip"),
    });

    if (!parsedData.success) {
      setError("Please enter a valid street address.");
      return;
    }

    const { street, zip } = parsedData.data;
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await refine(street, zip);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (!res) setError("District not refined. Please try again.");
    else setError(null);
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-between items-center relative w-full h-full max-w-[42rem] mx-auto"
        onClick={() => inputRef.current?.focus()}
      >
        <input type="hidden" name="zip" value={zip} />
        <motion.input
          type="text"
          ref={inputRef}
          layoutId="refine-wrapper"
          className="border-[2px] border-[var(--background-color)] placeholder:text-[var(--background-color)] placeholder:opacity-60 text-lg leading-tight w-full h-[2.25rem] py-0 pr-[80px] bg-transparent"
          style={{
            color:
              "color-mix(in srgb, var(--background-color) 60%, transparent)",
          }}
          placeholder="Enter your street address"
          name="street"
          required
        />
        <motion.button
          layoutId="button-square"
          initial={{ opacity: 0, filter: "blur(7px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          className="self-end bg-[var(--red-accent)] text-[var(--background-color)] border-[2px] border-[var(--background-color)] w-[70px] h-[35px] active:scale-95 overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            {!loading ? (
              <motion.p
                layoutId="refine-text"
                key="refine"
                exit={{ y: 50 }}
                className="text-[var(--background-color)]"
              >
                refine
              </motion.p>
            ) : (
              <motion.div
                className="w-full flex items-center justify-center"
                key="loading"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ ease: "easeOut" }}
              >
                <Loader className="animate-spin text-[var(--background-color)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </>
  );
}
