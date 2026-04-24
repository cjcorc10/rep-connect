"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import DistrictMapLegend from "@/app/components/districtMapLegend/districtMapLegend";
import RepsLevelTabs from "@/app/components/repsLevelTabs/repsLevelTabs";
import RepsPanel from "@/app/components/repsWrapper/repsPanel";
import Banner from "@/app/components/banner/banner";
import clsx from "clsx";
import styles from "./repsPageClient.module.scss";
import Refine from "@/app/components/refine/refine";
import { useRepsPage } from "../../hooks/useRepsPage";
import { RepsLocationPayload } from "@/app/lib/definitions";

type Props = {
  payload: RepsLocationPayload;
};

export default function RepsPageClient({ payload }: Props) {
  const {
    activeLevel,
    setActiveLevel,
    mapSection,
    legend,
    panel,
    refine,
  } = useRepsPage({ payload });

  return (
    <>
      <main
        className={clsx(
          "pt-1 pb-4 sm:pt-2 sm:pb-6 w-full relative flex flex-col items-center justify-start",
          styles.main,
        )}
      >
        <RepsLevelTabs
          value={activeLevel}
          onChange={setActiveLevel}
        />
        <section className={styles.headerSection}>
          <div className={styles.mapContainer}>
            <div className={styles.mapWithLegend}>
              <div className={styles.mapCanvas}>
                <DistrictMap
                  districtGeoJson={mapSection.districtGeoJson}
                  mapFallback={mapSection.mapFallback}
                />
              </div>
              <DistrictMapLegend {...legend} />
            </div>
          </div>
          <Refine {...refine} />
        </section>
      </main>
      <Banner />
      <RepsPanel level={activeLevel} {...panel} />
    </>
  );
}
