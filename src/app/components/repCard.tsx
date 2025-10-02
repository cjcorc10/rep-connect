'use client';
import Image from 'next/image';
import { Rep } from '../lib/definitions';
import clsx from 'clsx';
import { Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => router.push(`/rep/${rep.bioguide_id}`)}
      className="mb-4 rounded-lg flex flex-row min-h-[175px] shadow-lg bg-white border border-gray-200"
    >
      <div className="flex justify-center p-8 items-center w-[140px] relative">
        <Image
          className="w-[100px] h-[100px] shadow-md rounded-full absolute object-cover object-top"
          src={rep.image_url || ''}
          width={100}
          height={100}
          alt={rep.full_name}
        />
        <p
          className={clsx(
            'font-bold text-white shadow-md text-xl relative top-[40px] left-[35px] rounded-full w-6 h-6 text-center flex items-center justify-center',
            {
              'bg-blue-500': rep.party === 'Democrat',
              'bg-red-500': rep.party === 'Republican',
              'bg-green-500': rep.party === 'Independent',
              'bg-gray-500': !rep.party,
            }
          )}
        >
          {rep.party === 'Democrat'
            ? 'D'
            : rep.party === 'Republican'
            ? 'R'
            : rep.party === 'Independent'
            ? 'I'
            : ''}
        </p>
      </div>
      <div className="flex flex-col flex-1 py-6 pr-6 justify-between">
        <div className=" flex flex-col gap-1">
          <h3 className="text-2xl font-bold flex items-center text-blue-500">
            {rep.full_name}
          </h3>
          <p className="flex flex-row gap-2 text-gray-700 ">
            <MapPin color="black" size={20} /> {rep.address}
          </p>
          <a
            href={`tel:${rep.phone}`}
            className="text-blue-600 flex flex-row gap-2"
          >
            <Phone size={20} />
            {rep.phone}
          </a>
        </div>
        <div></div>
      </div>
    </motion.div>
  );
}
