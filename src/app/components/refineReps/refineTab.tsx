"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/components/address/address.module.css";
import {
  RepsByAddressPayload,
  RepsLocationPayload,
} from "@/app/lib/definitions";

type RefineTabProps = {
  open?: boolean;
  zip: string;
  refineByAddress: (address: string) => Promise<RepsByAddressPayload>;
  onRefineSuccess: (next: RepsLocationPayload) => void;
};

const normalizeRepPayload = (
  repPayload: RepsByAddressPayload,
): RepsLocationPayload => ({
  data: {
    state: repPayload.state,
    districts: repPayload.districts,
    houseReps: repPayload.houseReps,
    senateReps: repPayload.senateReps,
    stateLegislators: repPayload.stateLegislators,
    stateDistricts: repPayload.stateDistricts,
    stateDistrictGeoJson: repPayload.stateDistrictGeoJson,
  },
  cityStateLabel: repPayload.cityStateLabel,
  districtGeoJson: repPayload.districtGeoJson,
  mapFallback: repPayload.mapFallback,
});

export default function RefineTab({
  open = true,
  zip,
  refineByAddress,
  onRefineSuccess,
}: RefineTabProps) {
  const [street, setStreet] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!open) return;

    const trimmed = street.trim();
    if (!trimmed) return;

    setPending(true);
    setError(null);
    try {
      const payload = await refineByAddress(`${trimmed}, ${zip}`);
      if (payload.districts.length > 1) {
        setError("Still multiple districts. Try a fuller address.");
        return;
      }
      onRefineSuccess(normalizeRepPayload(payload));
      setStreet("");
    } catch {
      setError("Refine unsuccessful. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.addressContainer}>
      <div className={styles.addressContent}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              className={styles.addressTitle}
              value={street}
              onChange={(e) => setStreet(e.currentTarget.value)}
              placeholder="Street name"
              aria-label="Street name"
              disabled={pending}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="Refine"
              disabled={pending}
            >
              <span className={styles.refineLabel}>refine</span>
            </button>
          </div>
        </form>
        {error && (
          <p className={styles.refineError} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
