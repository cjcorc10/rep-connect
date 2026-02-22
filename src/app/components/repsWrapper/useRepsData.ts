"use client";

import { useState, useEffect, useRef } from "react";
import type { RepsData } from "../../lib/definitions";

export type { RepsData };

export function useRepsData(address: string) {
  const [data, setData] = useState<RepsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const fetchAddressRef = useRef<string | null>(null);
  const lastFetchedAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const currentAddress = address;
    fetchAddressRef.current = currentAddress;

    const alreadyHaveDataForThisAddress =
      lastFetchedAddressRef.current === currentAddress &&
      data !== null;
    if (alreadyHaveDataForThisAddress) return;

    lastFetchedAddressRef.current = currentAddress;
    setLoading(true);
    setNotFoundError(false);

    async function fetchReps() {
      try {
        const response = await fetch("/api/reps", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: currentAddress }),
        });

        if (fetchAddressRef.current !== currentAddress) return;

        if (!response.ok) {
          if (response.status === 404) {
            setNotFoundError(true);
            return;
          }
          throw new Error("Failed to fetch representatives");
        }

        const repsData = await response.json();
        if (fetchAddressRef.current !== currentAddress) return;
        setData(repsData);
      } catch (err) {
        if (fetchAddressRef.current !== currentAddress) return;
        console.error("Error fetching reps:", err);
        setNotFoundError(true);
      } finally {
        if (fetchAddressRef.current === currentAddress) {
          setLoading(false);
        }
      }
    }

    fetchReps();
    return () => {
      fetchAddressRef.current = null;
    };
  }, [address, data]);

  return { data, loading, notFoundError };
}
