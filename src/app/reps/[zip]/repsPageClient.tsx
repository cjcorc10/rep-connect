"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import RepsWrapper from "@/app/components/repsWrapper/repsWrapper";
import type {
  Coordinates,
  DistrictMapFeatureCollection,
  Rep,
  RepsData,
} from "@/app/lib/definitions";
import Banner from "@/app/components/banner/banner";
import Menu from "@/app/components/menu/menu";
import { useRepStore } from "@/app/store/useRepStore";
import { useEffect } from "react";
import styles from "./repsPageClient.module.scss";

type Props = {
  zipFromRoute: string;
  data: RepsData;
  cityStateLabel: string;
  districtGeoJson: DistrictMapFeatureCollection | null;
  mapFallback: {
    bounds?: Coordinates;
    location?: { lat: number; lng: number };
  };
};

export default function RepsPageClient({
  zipFromRoute,
  data,
  cityStateLabel,
  districtGeoJson,
  mapFallback,
}: Props) {
  const { activeRep, setReps } = useRepStore();
  useEffect(() => {
    setReps(data.senateReps.concat(data.houseReps) as Rep[]);
  }, [data.houseReps, data.senateReps, setReps]);

  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <>
      {activeRep ? <Menu /> : null}
      <main className="py-4 sm:py-6 h-[100vh] relative flex flex-col items-center justify-center">
        <section className={styles.headerSection}>
          <header className={styles.header}>
            <div className={styles.addressContainer}>
              <h1>Showing results for</h1>
              <h1 className={styles.addressText}>{zipFromRoute}</h1>
            </div>
            <div className={styles.cityContainer}>
              <h1>{cityStateLabel}</h1>
            </div>
          </header>
          <div className={styles.mapContainer}>
            <DistrictMap
              apiKey={mapsApiKey}
              districtGeoJson={districtGeoJson}
              mapFallback={mapFallback}
            />
          </div>
        </section>
      </main>
      <Banner />
      <div>
        <RepsWrapper repsData={data} />
      </div>
    </>
  );
}
