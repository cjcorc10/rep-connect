"use client";

import RepsPanel from "@/app/components/roster/repsPanel";
import styles from "./repsPageClient.module.scss";
import { useRepsPage } from "../../hooks/useRepsPage";
import { RepsLocationPayload } from "@/app/lib/definitions";
import { motion } from "framer-motion";
import GovLevelTabs from "@/app/components/govLevelTabs/govLevelTabs";
import ResultsHeader from "@/app/reps/[zip]/resultsHeader";
import { ResultsSection } from "./resultsSection";
import Address from "@/app/components/address/address";
import RefineTab from "@/app/components/refineReps/refineTab";
import { SideTab } from "@/app/components/sideTab/sideTab";

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
      {/* <SideTab className={styles.addressTab}>
        {({ open }) =>
          refine.multipleDistricts ? (
            <RefineTab
              open={open}
              zip={zip}
              refineByAddress={refine.refineByAddress}
              onRefineSuccess={refine.onRefineSuccess}
            />
          ) : (
            <Address address={zip} open={open} />
          )
        }
      </SideTab> */}
      <div className={styles.govLevelTabsContainer}>
        {/* <GovLevelTabs
          currentLevel={activeLevel}
          onChange={setActiveLevel}
        /> */}
      </div>
      <div className={styles.resultsContainer}>
        <FadeupContainer delay={1}>
          <div className={styles.header}>
            <h1 className={styles.headerText}>
              District search results...
            </h1>
          </div>
        </FadeupContainer>

        <FadeupContainer delay={0.75}>
          <ResultsHeader zip={zip} label={label} refine={refine} />
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
  line = true,
}: {
  delay: number;
  play?: boolean;
  children: React.ReactNode;
  line?: boolean;
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
      {line && <div className={styles.line} />}
      {children}
    </motion.div>
  );
};
