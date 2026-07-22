"use client";

import RepsPanel from "@/app/components/roster/repsPanel";
import styles from "./repsPageClient.module.scss";
import { useRepsPage } from "../../hooks/useRepsPage";
import { RepsLocationPayload } from "@/app/lib/definitions";
import { motion } from "framer-motion";
import GovLevelTabs from "@/app/components/govLevelTabs/govLevelTabs";
import ResultsHeader from "@/app/reps/[zip]/resultsHeader";
import { ResultsSection } from "./resultsSection";
import { useEffect } from "react";
import { usePageTransition } from "@/app/store/usePageTransition";

type Props = {
  payload: RepsLocationPayload;
  zip: string;
  label: string;
};

export default function RepsPageClient({
  payload,
  zip,
  label,
}: Props) {
  const {
    mapSection,
    legend,
    panel,
    refine,
    activeLevel,
    setActiveLevel,
  } = useRepsPage({
    payload,
  });

  const { setPageReady, status } = usePageTransition();
  useEffect(() => {
    setPageReady(true);
  }, [status, setPageReady]);
  if (status !== "idle") return null;

  return (
    <main>
      <div className={styles.resultsContainer}>
        <FadeupContainer delay={1}>
          <div className={styles.govLevelTabsContainer}>
            <GovLevelTabs
              currentLevel={activeLevel}
              onChange={setActiveLevel}
            />
          </div>
          <div className={styles.header}>
            <h1>Search Results...</h1>
          </div>
        </FadeupContainer>

        <FadeupContainer delay={0.75}>
          <ResultsHeader zip={zip} label={label} />
        </FadeupContainer>
        <FadeupContainer delay={0.5}>
          <ResultsSection
            mapSection={mapSection}
            zip={zip}
            activeLevel={activeLevel}
            legend={legend}
            refine={refine}
          />
        </FadeupContainer>
      </div>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "var(--background-color)",
          zIndex: "10",
        }}
      />
      <RepsPanel isFederal={activeLevel === "federal"} {...panel} />
    </main>
  );
}

const FadeupContainer = ({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) => {
  const animationVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };
  return (
    <motion.div
      variants={animationVariants}
      initial="initial"
      animate="animate"
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={styles.sectionWrapper}
    >
      {children}
    </motion.div>
  );
};
