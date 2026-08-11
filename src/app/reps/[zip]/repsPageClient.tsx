"use client";

import RepsPanel from "@/app/components/roster/repsPanel";
import styles from "./repsPageClient.module.scss";
import { useRepsPage } from "../../hooks/useRepsPage";
import { RepsLocationPayload } from "@/app/lib/definitions";
import { motion } from "framer-motion";
import GovLevelTabs from "@/app/components/govLevelTabs/govLevelTabs";
import ResultsHeader from "@/app/reps/[zip]/resultsHeader";
import { ResultsSection } from "./resultsSection";
import Header from "@/app/components/header/header";

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

  return (
    <main>
      <div className={styles.headerContainer}>
        {/* <FadeupContainer
          key={`h-${transitionId}`}
          delay={1.25}
          play={playEntrance}
        >
          <Header />
        </FadeupContainer> */}
      </div>
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

      <RepsPanel isFederal={activeLevel === "federal"} {...panel} />
    </main>
  );
}

const FadeupContainer = ({
  delay,
  play = true,
  children,
}: {
  delay: number;
  play?: boolean;
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
      animate={play ? "animate" : "initial"}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={styles.sectionWrapper}
    >
      {children}
    </motion.div>
  );
};
