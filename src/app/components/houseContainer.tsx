"use client";
import RepCard from "@/app/components/repCard/repCard";
import type { Rep } from "@/app/lib/definitions";
import { useState } from "react";
import { motion } from "framer-motion";
import ContainerHeading from "./containerHeading";
import Refine from "./refine/refine";

export default function HouseContainer({
  initialReps,
}: {
  initialReps: Rep[];
}) {
  const [reps, setReps] = useState<Rep[]>(initialReps);
  const [refining] = useState(reps.length > 1);
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
  const refineReps = async (street: string, zip: string) => {
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
    <section aria-labelledby="house-heading" className="mt-6">
      <ContainerHeading isSenate={false}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="mt-1 text-t1 text-gray-600">
            House member representing{" "}
            {multipleDistricts
              ? `districts ${districts.join(", ")} in ${
                  reps[0].state
                }`
              : `district ${districts[0]} in ${reps[0].state}`}
          </p>
          <p className="text-t1 text-gray-600 font-bold bg-gray-200 p-2 rounded-md">
            {reps.length} {reps.length === 1 ? "rep" : "reps"} found
          </p>
        </div>
      </ContainerHeading>

      {refining && (
        <Refine
          refineReps={refineReps}
          multipleDistricts={multipleDistricts}
        />
      )}

      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 40,
          ease: "easeOut",
        }}
        className="flex flex-wrap gap-16 justify-center"
      >
        {reps.map((rep) => (
          <RepCard key={rep.bioguide_id} rep={rep} />
        ))}
      </motion.div>

      {reps.length === 0 && !multipleDistricts && (
        <div className="mt-6 rounded-lg border border-gray-200 p-6 text-center text-gray-600">
          No House representatives found for this address.
        </div>
      )}
    </section>
  );
}
