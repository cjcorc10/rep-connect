"use client";
import StreetForm from "../streetForm";
import RefineContainer from "./container/refineContainer";
import styles from "./refine.module.scss";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type {
  Coordinates,
  DistrictMapFeatureCollection,
  Rep,
  RepsData,
  StateDistrict,
  StateLegislator,
} from "../../lib/definitions";

type RefineProps = {
  multipleDistricts: boolean;
  onRefineSuccess?: (payload: {
    data: RepsData;
    cityStateLabel: string;
    districtGeoJson: DistrictMapFeatureCollection | null;
    mapFallback: {
      bounds?: Coordinates;
      location?: { lat: number; lng: number };
    };
  }) => void;
};

export default function Refine({
  multipleDistricts,
  onRefineSuccess,
}: RefineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [refined, setRefined] = useState<boolean | null>(null);

  useEffect(() => {
    if (refined === false) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setRefined(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [refined]);

  const handleRefine = async (
    street: string,
    zipCode: string,
  ): Promise<boolean> => {
    const address = `${street}, ${zipCode}`;
    const res = await fetch("/api/reps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) {
      setRefined(false);
      return false;
    }
    const data = (await res.json()) as {
      state: string;
      districts: string[];
      houseReps?: Rep[];
      senateReps?: Rep[];
      stateLegislators?: StateLegislator[];
      stateDistricts?: StateDistrict[];
      stateDistrictGeoJson?: DistrictMapFeatureCollection | null;
      cityStateLabel?: string;
      districtGeoJson?: DistrictMapFeatureCollection | null;
      mapFallback?: {
        bounds?: Coordinates;
        location?: { lat: number; lng: number };
      };
    };
    const success =
      Array.isArray(data.houseReps) && data.houseReps.length === 1;
    if (success) {
      setRefined(true);
      onRefineSuccess?.({
        data: {
          state: data.state,
          districts: data.districts,
          houseReps: data.houseReps ?? [],
          senateReps: data.senateReps ?? [],
          stateLegislators: data.stateLegislators ?? [],
          stateDistricts: data.stateDistricts ?? [],
          stateDistrictGeoJson: data.stateDistrictGeoJson ?? null,
        },
        cityStateLabel: data.cityStateLabel ?? "",
        districtGeoJson: data.districtGeoJson ?? null,
        mapFallback: data.mapFallback ?? {},
      });
    } else {
      setRefined(false);
    }
    return success;
  };

  if (!multipleDistricts) return null;

  return (
    <section
      className={styles.main}
      role="dialog"
      aria-label="Refine district results"
    >
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, transform: "translateY(12px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <RefineContainer>
          <AnimatePresence mode="popLayout">
            {!isOpen ? (
              <motion.div
                key="popup"
                className={clsx(
                  styles.contentWrapper,
                  styles.contentWrapperIntro,
                )}
              >
                <motion.p
                  exit={{ y: -80, opacity: 0 }}
                  className={styles.message}
                >
                  Multiple districts were returned from your ZIP code.
                  To refine results, click refine.
                </motion.p>
                <motion.button
                  layoutId="refine-wrapper"
                  className={styles.button}
                  onClick={() => setIsOpen(true)}
                >
                  <motion.p layoutId="refine-text">refine</motion.p>
                </motion.button>
              </motion.div>
            ) : (
              <div>
                <AnimatePresence mode="popLayout" initial={false}>
                  {refined === true ? (
                    <motion.div
                      key="reps-refined"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 40, opacity: 0, filter: "blur(7px)" }}
                      transition={{ ease: "easeOut" }}
                      className={styles.status}
                    >
                      <p>Reps refined</p>
                      <div className="flex justify-center items-center bg-black rounded-full p-2">
                        <Check className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>
                  ) : showError ? (
                    <motion.div
                      key="unsuccessful"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 40, opacity: 0, filter: "blur(7px)" }}
                      transition={{ ease: "easeOut" }}
                      className={styles.status}
                    >
                      <p>Unsuccessful, please try again</p>
                      <motion.div
                        initial={{ scale: 0.75 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center items-center bg-black rounded-full p-2"
                      >
                        <X className="w-7 h-7 text-white" />
                      </motion.div>
                      <p></p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="street-form"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ filter: "blur(7px)", opacity: 0 }}
                      className={styles.contentWrapper}
                    >
                      <StreetForm refine={handleRefine} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </RefineContainer>
      </motion.div>
    </section>
  );
}
