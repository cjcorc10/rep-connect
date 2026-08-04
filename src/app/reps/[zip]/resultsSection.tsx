import { Legend, MapSection, Refine } from "@/app/lib/definitions";
import styles from "./repsPageClient.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import DistrictMapLegend from "@/app/components/districtMapLegend/districtMapLegend";
import DistrictMap from "@/app/components/districtMap/districtMap";
import { RefineReps } from "@/app/components/refineReps/refineReps";

export const ResultsSection = ({
  mapSection,
  activeLevel,
  zip,
  legend,
  refine,
}: {
  mapSection: MapSection;
  activeLevel: string;
  zip: string;
  legend: Legend;
  refine: Refine;
}) => {
  return (
    <div className={styles.mapSectionContainer}>
      <section className={styles.districtSection}>
        <h1 className={styles.title}>Districts</h1>
        {refine && (
          <p className={styles.districtDescription}>
            Multiple districts returned for you zip code. Find your
            district on the map.
          </p>
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`legend-${activeLevel}`}
            initial={{
              filter: "blur(7px)",
              x: "-100%",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              x: 0,
            }}
            exit={{
              filter: "blur(7px)",
              x: "-100%",
            }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={styles.legendContainer}
          >
            <DistrictMapLegend {...legend} />
          </motion.div>
        </AnimatePresence>
        {/* <Refine {...refine} /> */}
      </section>
      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapWithLegend}>
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={`map-${activeLevel}`}
                initial={{
                  opacity: 0,
                  filter: "blur(7px)",
                  y: "100%",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                }}
                exit={{
                  filter: "blur(7px)",
                  y: "-100%",
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={styles.mapCanvas}
              >
                <DistrictMap
                  searchZip={zip}
                  districtGeoJson={mapSection.districtGeoJson}
                  mapFallback={mapSection.mapFallback}
                  level={mapSection.level}
                  houseReps={mapSection.houseReps}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};
