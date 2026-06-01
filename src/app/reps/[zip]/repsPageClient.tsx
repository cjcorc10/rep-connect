"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import DistrictMapLegend from "@/app/components/districtMapLegend/districtMapLegend";
import RepsPanel from "@/app/components/repsWrapper/repsPanel";
import Banner from "@/app/components/banner/banner";
import clsx from "clsx";
import styles from "./repsPageClient.module.scss";
import Refine from "@/app/components/refine/refine";
import { useRepsPage } from "../../hooks/useRepsPage";
import { RepsLocationPayload } from "@/app/lib/definitions";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import GovLevelTabs, {
  GovLevel,
} from "@/app/components/govLevelTabs/govLevelTabs";

type Props = {
  payload: RepsLocationPayload;
};

export default function RepsPageClient({ payload }: Props) {
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
      <main
        className={clsx(
          "pt-1 pb-4 sm:pt-2 sm:pb-6 w-full relative flex flex-col items-center justify-start",
          styles.main,
        )}
      >
        <GovLevelTabs
          ref={mapSectionRef}
          currentLevel={activeLevel}
          onChange={(level: GovLevel) => setActiveLevel(level)}
        />
        <section className={styles.headerSection}>
          <div ref={mapSectionRef} className={styles.mapContainer}>
            <div className={styles.mapWithLegend}>
              <AnimatePresence mode="popLayout">
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
                    districtGeoJson={mapSection.districtGeoJson}
                    mapFallback={mapSection.mapFallback}
                  />
                </motion.div>
              </AnimatePresence>
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
              >
                <DistrictMapLegend {...legend} />
              </motion.div>
            </div>
          </div>
          <Refine {...refine} />
        </section>
      </main>
      {/* <Banner /> */}
      <RepsPanel isFederal={activeLevel === "federal"} {...panel} />
    </>
  );
}
