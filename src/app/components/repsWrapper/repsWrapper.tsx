"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import RepCard from "../repCard/repCard";
import { Rep } from "../../lib/definitions";
import styles from "./repsWrapper.module.scss";

type RepsData = {
  state: string;
  districts: string[];
  houseReps: Rep[];
  senateReps: Rep[];
};

export default function RepsWrapper({
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
    <div className={styles.main}>
      <div className={styles.textContainer}>
        <div className={styles.congress}>
          <h1 className={styles.senate}>Senate</h1>
          <h1 className={styles.house}>House</h1>
        </div>
        <div className={styles.names}>
          {data.senateReps.map((senator) => (
            <h2
              key={senator.bioguide_id}
              className={styles.senateName}
            >
              {senator.full_name}
            </h2>
          ))}
          {data.houseReps.map((rep) => (
            <h2 key={rep.bioguide_id} className={styles.houseName}>
              {rep.full_name}
            </h2>
          ))}
        </div>
      </div>
      <div className={styles.images}>
        {data.senateReps.map((senator) => (
          <RepCard key={senator.bioguide_id} rep={senator} />
        ))}
        {data.houseReps.map((rep) => (
          <RepCard key={rep.bioguide_id} rep={rep} />
        ))}
      </div>
    </div>
  );
}
