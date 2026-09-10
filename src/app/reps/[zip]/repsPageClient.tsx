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
import { useState } from "react";
import { useLenis } from "lenis/react";

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
  const [openItem, setOpenItem] = useState("");
  const lenis = useLenis();

  const selectRep = (id: string) => {
    if (openItem === id) {
      const el = document.getElementById(`roster-row-${id}`);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: 0, force: true });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    setOpenItem(id);
  };

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
            onSelectRep={selectRep}
          />
        </FadeupContainer>
      </div>
      <RepsPanel
        isFederal={activeLevel === "federal"}
        {...panel}
        openItem={openItem}
        onOpenItemChange={setOpenItem}
      />
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
