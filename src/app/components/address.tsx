'use client';
import { motion } from 'framer-motion';
type AddressProps = {
  address: string;
};

export default function Address({ address }: AddressProps) {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="flex justify-center items-center w-24 h-24 bg-blue-200 opacity-80 rounded-full z-0"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, scale: { type: 'spring' } }}
      >
        <h1 className="text-3xl text-blue-700 z-10 font-bold whitespace-nowrap">
          {address}
        </h1>
      </motion.div>
    </div>
  );
}
