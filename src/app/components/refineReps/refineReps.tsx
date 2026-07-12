import { useEffect, useState } from "react";
import { BeautifulButton } from "../button/beautifulButton";
import styles from "./refine.module.scss";
import { RefineContainer } from "./refineContainer";
import { AnimatePresence, motion } from "framer-motion";
import {
  RepsByAddressPayload,
  RepsLocationPayload,
} from "@/app/lib/definitions";
import { useParams } from "next/navigation";
import { REFINE_FORM_ID, RefineForm } from "./refineForm";
import clsx from "clsx";

type RefineAddressFormProps = {
  refineByAddress: (address: string) => Promise<RepsByAddressPayload>;
  onRefineSuccess: (next: RepsLocationPayload) => void;
};

type RefinePhase =
  | "initial"
  | "form"
  | "loading"
  | "success"
  | "failure";

const STATUS_TIMEOUT_MS = 3000;

const STATUS_MESSAGE: Record<"success" | "failure", string> = {
  success: "Refine successful",
  failure: "Refine unsuccessful. Please try again",
};

const REFINE_BUTTON_LABEL = {
  initial: "refine",
  form: "submit",
};

const normalizeRepPayload = (
  repPayload: RepsByAddressPayload,
): RepsLocationPayload => {
  return {
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
  };
};

const isMultipleDistricts = (
  repPayload: RepsByAddressPayload,
): boolean => {
  return repPayload.districts.length > 1;
};

export const RefineReps = ({
  refineByAddress,
  onRefineSuccess,
}: RefineAddressFormProps) => {
  const { zip } = useParams();
  const [phase, setPhase] = useState<RefinePhase>("initial");

  useEffect(() => {
    if (phase !== "failure") return;

    const timer = window.setTimeout(() => {
      setPhase("form");
    }, STATUS_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const refineAddress = async (street: string): Promise<boolean> => {
    try {
      const repPayload = await refineByAddress(`${street}, ${zip}`);

      if (isMultipleDistricts(repPayload)) {
        return false;
      }

      onRefineSuccess(normalizeRepPayload(repPayload));
      return true;
    } catch (error) {
      console.error("Failed to refine reps: ", error);
      return false;
    }
  };

  const buttonLabel =
    phase === "initial"
      ? REFINE_BUTTON_LABEL.initial
      : REFINE_BUTTON_LABEL.form;

  return (
    <RefineContainer>
      <div className={styles.phaseArea}>
        <AnimatePresence mode="popLayout" initial={false}>
          {phase === "initial" && (
            <motion.div
              key="initial"
              exit={{ x: "-100%", filter: "blur(7px)", opacity: 0 }}
              transition={{ ease: "easeOut" }}
              className={styles.initialView}
            >
              <div className={styles.message}>
                <p>Not sure what district you&apos;re in?</p>
              </div>
            </motion.div>
          )}
          {phase === "form" && (
            <motion.div
              initial={{ x: "100%", filter: "blur(7px)", opacity: 0 }}
              animate={{ x: 0, filter: "blur(0px)", opacity: 1 }}
              exit={{ x: "-100%", filter: "blur(7px)", opacity: 0 }}
              transition={{ ease: "easeOut" }}
              key="form"
              className={styles.streetForm}
            >
              <RefineForm
                setPhase={setPhase}
                handleRefine={refineAddress}
              />
            </motion.div>
          )}
          {phase === "loading" ? (
            <motion.div
              key="refine-loading"
              className={styles.formLoadingOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              aria-live="polite"
              aria-label="Loading results"
            >
              <svg
                className={styles.formSpinner}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className={styles.formSpinnerArc}
                  cx="12"
                  cy="12"
                  r="10"
                  pathLength="100"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          ) : phase === "success" || phase === "failure" ? (
            <>
              <motion.p
                key={phase}
                className={styles.formStatusMessage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                role="status"
              >
                {STATUS_MESSAGE[phase]}
              </motion.p>
            </>
          ) : null}
        </AnimatePresence>
      </div>
      <div className={styles.buttonFooter}>
        <button className={styles.refineButton}>{buttonLabel}</button>
        {/* <BeautifulButton
          type={phase === "form" ? "submit" : "button"}
          formId={phase === "form" ? REFINE_FORM_ID : undefined}
          onClick={
            phase === "initial" ? () => setPhase("form") : () => {}
          }
        >
          {buttonLabel}
        </BeautifulButton> */}
      </div>
    </RefineContainer>
  );
};
