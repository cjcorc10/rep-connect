"use client";
import RepCard from "@/app/components/repCard/repCard";
import StreetForm from "@/app/components/streetForm";
import type { Rep } from "@/app/lib/definitions";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContainerHeading from "./containerHeading";

export default function HouseContainer({
  initialReps,
}: {
  initialReps: Rep[];
}) {
  const [reps, setReps] = useState<Rep[]>(initialReps);

  // fetch house reps based on street and zip entered
  const fetchReps = async (street: string, zip: string) => {
    const res = await fetch("/api/house", {
      method: "POST",
      body: JSON.stringify({ street, zip }),
    });
    const data = await res.json();
    return data.reps;
  };

  // decide to change state based on if refine was successful
  const refine = async (street: string, zip: string) => {
    const newReps = await fetchReps(street, zip);
    if (newReps.length !== reps.length) {
      setReps(newReps);
      return true;
    } else {
      return false;
    }
  };

  const districts = Array.from(
    new Set(reps.map((rep) => rep.district))
  );
  const multipleDistricts = districts.length > 1;

  return (
    <section aria-labelledby="house-heading" className="mt-6 sm:mt-8">
      <ContainerHeading isSenate={false}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="mt-1 text-md text-gray-600">
            House member representing{" "}
            {multipleDistricts
              ? `districts ${districts.join(", ")} in ${
                  reps[0].state
                }`
              : `district ${districts[0]} in ${reps[0].state}`}
          </p>
          <p className="text-md text-gray-600 font-bold bg-gray-200 px-4 py-2 rounded-md ">
            {reps.length} {reps.length === 1 ? "rep" : "reps"} found
          </p>
        </div>
      </ContainerHeading>

      <motion.div layout>
        <AnimatePresence mode="wait">
          {multipleDistricts && (
            <motion.div
              className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col items-center"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0)",
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              exit={{
                opacity: 0,
                filter: "blur(4px)",
                height: 0,
                padding: 0,
                marginBottom: 0,
                overflow: "hidden",
              }}
            >
              <p className="text-sm sm:text-base font-medium text-amber-900">
                We couldn’t determine a single district from your ZIP.
                Add a street name to narrow it down or select from one
                of the options below.{" "}
              </p>
              <StreetForm refine={refine} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40,
            ease: "easeOut",
          }}
          className="
          grid gap-4 sm:gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
        "
        >
          {reps.map((rep) => (
            <div key={rep.bioguide_id}>
              <RepCard rep={rep} />
            </div>
          ))}
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
