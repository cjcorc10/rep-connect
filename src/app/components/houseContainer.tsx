'use client';
import RepCard from '@/app/components/repCard';
import StreetForm from '@/app/components/streetForm';
import type { Rep } from '@/app/lib/definitions';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HouseContainer({
  initialReps,
}: {
  initialReps: Rep[];
}) {
  const [reps, setReps] = useState<Rep[]>(initialReps);

  const refine = async (street: string, zip: string) => {
    const res = await fetch('/api/house', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ street, zip }),
    });
    const data = await res.json();
    if (data.reps) setReps(data.reps);
  };

  const districts = Array.from(
    new Set(reps.map((rep) => rep.district))
  );
  const multipleDistricts = districts.length > 1;

  return (
    <section aria-labelledby="house-heading" className="mt-6 sm:mt-8">
      <header className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2
            id="house-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            U.S. House of Representatives
          </h2>
          <p className="text-md text-gray-600 font-bold bg-gray-200 px-4 py-2 rounded-md">
            {reps.length} {reps.length === 1 ? 'rep' : 'reps'} found
          </p>
        </div>
        <p className="mt-1 text-md text-gray-600">
          House member representing{' '}
          {multipleDistricts
            ? `districts ${districts.join(', ')} in ${reps[0].state}`
            : `district ${districts[0]} in ${reps[0].state}`}
        </p>
      </header>
      <motion.div layout>
        <AnimatePresence mode="wait">
          {multipleDistricts && (
            <motion.div
              className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col items-center"
              animate={{
                opacity: 1,
                rotate: [0, 1, -1, 0],
                scale: [1, 1.02, 1.02, 1],
              }}
              transition={{
                duration: 0.5,
              }}
              exit={{
                opacity: 0,
                height: 0,
                padding: 0,
                marginBottom: 0,
                overflow: 'hidden',
              }}
            >
              <p className="text-sm sm:text-base font-medium text-amber-900">
                We couldn’t determine a single district from your ZIP.
                Add a street name to narrow it down or select from one
                of the options below.{' '}
              </p>
              <StreetForm refine={refine} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 40,
          }}
          className="
          grid gap-4 sm:gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
        "
        >
          <AnimatePresence initial={false}>
            {reps.map((rep, i) => (
              <motion.div
                key={rep.bioguide_id}
                layout
                exit={{
                  x: '-25%',
                  opacity: 0,
                  y: '-25%',
                  rotate: -45,
                }}
                transition={{ duration: 0.5, delay: 0.33 * ++i }}
              >
                <RepCard rep={rep} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {reps.length === 0 && !multipleDistricts && (
        <div className="mt-6 rounded-lg border border-gray-200 p-6 text-center text-gray-600">
          No House representatives found for this address.
        </div>
      )}
    </section>
  );
}
