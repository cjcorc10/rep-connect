"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import DistrictMapLegend from "@/app/components/districtMapLegend/districtMapLegend";
import RepsPanel from "@/app/components/roster/repsPanel";
import clsx from "clsx";
import styles from "./repsPageClient.module.scss";
import { useRepsPage } from "../../hooks/useRepsPage";
import { RepsLocationPayload } from "@/app/lib/definitions";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import GovLevelTabs from "@/app/components/govLevelTabs/govLevelTabs";
import { Refine } from "@/app/components/refine/refine";

type Props = {
  payload: RepsLocationPayload;
  zip: string;
};

export default function RepsPageClient({ payload, zip }: Props) {
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

  const mapSectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <main className={styles.main}>
        <section className={styles.mapSection}>
          <div ref={mapSectionRef} className={styles.mapContainer}>
            <div className={styles.mapWithLegend}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  initial={{
                    opacity: 0,
                    filter: "blur(7px)",
                    x: 50,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={styles.legendColumn}
                >
                  <DistrictMapLegend {...legend} />
                  <Refine {...refine} />
                </motion.div>
                <motion.div
                  className={styles.mapCanvas}
                  key={`map-canvas-${activeLevel}`}
                  initial={{
                    opacity: 0,
                    filter: "blur(7px)",
                    y: 50,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    x: 0,
                  }}
                  exit={{
                    filter: "blur(7px)",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <DistrictMap
                    searchZip={zip}
                    districtGeoJson={mapSection.districtGeoJson}
                    mapFallback={mapSection.mapFallback}
                    level={mapSection.level}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <GovLevelTabs
            currentLevel={activeLevel}
            onChange={setActiveLevel}
          />
        </section>
      </main>
      {/* <Banner /> */}
      <RepsPanel isFederal={activeLevel === "federal"} {...panel} />
    </>
  );
}
