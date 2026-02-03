"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import SenateContainer from "./senateContainer";
import HouseContainer from "./houseContainer";
import RepCard from "./repCard/repCard";
import { Rep } from "../lib/definitions";
// import RepsSkeleton from "./skeletons/repsSkeleton";

type RepsData = {
  state: string;
  districts: string[];
  houseReps: Rep[];
  senateReps: Rep[];
};

export default function RepFetchWrapper({
  address,
}: {
  address: string;
}) {
  const [data, setData] = useState<RepsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    async function fetchReps() {
      try {
        setLoading(true);
        setNotFoundError(false);
        const response = await fetch("/api/reps", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setNotFoundError(true);
            return;
          }
          throw new Error("Failed to fetch representatives");
        }

        const repsData = await response.json();
        setData(repsData);
      } catch (err) {
        console.error("Error fetching reps:", err);
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReps();
  }, [address]);

  if (loading) {
    // return <RepsSkeleton />;
    return null;
  }

  if (notFoundError) {
    notFound();
    return null; // This line won't execute, but satisfies TypeScript
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <SenateContainer state={data.state}>
        {data.senateReps.map((senator) => (
          <RepCard key={senator.bioguide_id} rep={senator} />
        ))}
      </SenateContainer>
      <HouseContainer initialReps={data.houseReps} />
    </div>
  );
}
