"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import DistrictMapLegend from "@/app/components/districtMapLegend/districtMapLegend";
import Address from "@/app/components/address/address";
import CityStateLabel from "@/app/components/cityStateLabel/cityStateLabel";
import RepsLevelTabs from "@/app/components/repsLevelTabs/repsLevelTabs";
import RepsPanel from "@/app/components/repsWrapper/repsPanel";
import type { RepsByAddressPayload } from "@/app/lib/definitions";
import Banner from "@/app/components/banner/banner";
import clsx from "clsx";
import styles from "./repsPageClient.module.scss";
import Refine from "@/app/components/refine/refine";
import { useRepsPage } from "./useRepsPage";
import { motion } from "framer-motion";

type Props = {
  zip: string;
  payload: RepsByAddressPayload;
};

export default function RepsPageClient({ zip, payload }: Props) {
  const {
    activeLevel,
    setActiveLevel,
    cityStateLabel,
    mapSection,
    legend,
    panel,
    refine,
  } = useRepsPage({ payload });

  return (
    <>
      <main
        className={clsx(
          "py-4 sm:py-6 h-screen relative flex flex-col items-center justify-center",
          styles.main,
        )}
      >
        <RepsLevelTabs
          value={activeLevel}
          onChange={setActiveLevel}
        />
        <section className={styles.headerSection}>
          <header className={styles.header}>
            <Address address={zip} />
            <CityStateLabel label={cityStateLabel} />
          </header>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.mapContainer}
          >
            <div className={styles.mapWithLegend}>
              <div className={styles.mapCanvas}>
                <DistrictMap
                  districtGeoJson={mapSection.districtGeoJson}
                  mapFallback={mapSection.mapFallback}
                />
              </div>
              <DistrictMapLegend {...legend} />
            </div>
          </motion.div>
          <Refine {...refine} />
        </section>
      </main>
      <Banner />
      <RepsPanel level={activeLevel} {...panel} />
    </>
  );
}
