"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import Address from "@/app/components/address/address";
import RepsWrapper from "@/app/components/repsWrapper/repsWrapper";
import type {
  Coordinates,
  DistrictMapFeatureCollection,
  Rep,
  RepsData,
  StateLegislator,
} from "@/app/lib/definitions";
import {
  districtFeatureName,
  districtNumberForMarker,
  districtStyleIndexByName,
  paletteForDistrictRank,
} from "@/app/lib/districtMapStyles";
import Banner from "@/app/components/banner/banner";
import { useRepStore } from "@/app/store/useRepStore";
import { useEffect, useMemo, useState } from "react";
import styles from "./repsPageClient.module.scss";
import Refine from "@/app/components/refine/refine";

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
  const { setReps } = useRepStore();
  const [activeLevel, setActiveLevel] = useState<"federal" | "state">(
    "federal",
  );
  const [currentData, setCurrentData] = useState(data);
  const [currentCityStateLabel, setCurrentCityStateLabel] =
    useState(cityStateLabel);
  const [currentDistrictGeoJson, setCurrentDistrictGeoJson] =
    useState(districtGeoJson);
  const [currentMapFallback, setCurrentMapFallback] =
    useState(mapFallback);

  useEffect(() => {
    setCurrentData(data);
    setCurrentCityStateLabel(cityStateLabel);
    setCurrentDistrictGeoJson(districtGeoJson);
    setCurrentMapFallback(mapFallback);
  }, [data, cityStateLabel, districtGeoJson, mapFallback]);

  useEffect(() => {
    setReps(
      currentData.senateReps.concat(currentData.houseReps) as Rep[]
    );
  }, [currentData.houseReps, currentData.senateReps, setReps]);

  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const districtRankByLabel = useMemo(() => {
    const rankByLabel = new Map<string, number>();
    if (!currentDistrictGeoJson) return rankByLabel;

    const styleIndexByName = districtStyleIndexByName(
      currentDistrictGeoJson.features
    );

    currentDistrictGeoJson.features.forEach((feature, i) => {
      const name = districtFeatureName(feature.properties?.name, i);
      const rank = styleIndexByName.get(name);
      if (rank == null) return;
      const label = districtNumberForMarker(
        feature.properties?.name,
        rank
      );
      if (!rankByLabel.has(label)) {
        rankByLabel.set(label, rank);
      }
    });

    return rankByLabel;
  }, [currentDistrictGeoJson]);

  const districtColorByDistrict = useMemo(() => {
    const out: Record<string, { fill: string; stroke: string }> = {};
    currentData.districts.forEach((district, i) => {
      const rank = districtRankByLabel.get(String(district)) ?? i;
      out[String(district)] = paletteForDistrictRank(rank);
    });
    return out;
  }, [currentData.districts, districtRankByLabel]);

  const stateDistrictRankByMapKey = useMemo(() => {
    const rankByKey = new Map<string, number>();
    const stateGeo = currentData.stateDistrictGeoJson;
    if (!stateGeo) return rankByKey;

    const styleIndexByName = districtStyleIndexByName(stateGeo.features);
    stateGeo.features.forEach((feature, i) => {
      const name = districtFeatureName(feature.properties?.name, i);
      const rank = styleIndexByName.get(name);
      if (rank == null) return;
      const mapKey = String(feature.properties?.mapKey ?? "");
      if (mapKey && !rankByKey.has(mapKey)) {
        rankByKey.set(mapKey, rank);
      }
    });

    return rankByKey;
  }, [currentData.stateDistrictGeoJson]);

  const activeDistrictGeoJson =
    activeLevel === "state"
      ? currentData.stateDistrictGeoJson
      : currentDistrictGeoJson;

  return (
    <>
      <main className="py-4 sm:py-6 h-[100vh] relative flex flex-col items-center justify-center">
        <section className={styles.headerSection}>
          <header className={styles.header}>
            <div className={styles.addressContainer}>
              <h1>Showing results for</h1>
              <Address address={zipFromRoute} compact />
            </div>
            <div className={styles.cityContainer}>
              <h1>{currentCityStateLabel}</h1>
            </div>
          </header>
          <div className={styles.mapContainer}>
            <div className={styles.mapWithLegend}>
              <div className={styles.mapCanvas}>
                <DistrictMap
                  apiKey={mapsApiKey}
                  districtGeoJson={activeDistrictGeoJson}
                  mapFallback={currentMapFallback}
                />
              </div>
              <aside
                className={styles.legend}
                aria-label="District legend"
              >
                <h2 className={styles.legendTitle}>Districts</h2>
                <h3 className={styles.legendSubheader}>
                  {activeLevel === "state" ? "State" : "Federal"}
                </h3>
                <ul className={styles.legendList}>
                  {activeLevel === "state"
                    ? currentData.stateDistricts.map((d, i) => {
                        const rank =
                          stateDistrictRankByMapKey.get(d.mapKey) ?? i;
                        const color = paletteForDistrictRank(rank);
                        return (
                          <li
                            key={`${d.mapKey}-${i}`}
                            className={styles.legendItem}
                          >
                            <span
                              className={styles.legendSwatch}
                              style={{
                                backgroundColor: color.fill,
                                borderColor: color.stroke,
                              }}
                              aria-hidden
                            />
                            <span className={styles.legendText}>
                              {d.label}
                            </span>
                          </li>
                        );
                      })
                    : currentData.districts.map((district, i) => {
                        const rank =
                          districtRankByLabel.get(String(district)) ?? i;
                        const color = paletteForDistrictRank(rank);
                        return (
                          <li
                            key={`${currentData.state}-${district}-${i}`}
                            className={styles.legendItem}
                          >
                            <span
                              className={styles.legendSwatch}
                              style={{
                                backgroundColor: color.fill,
                                borderColor: color.stroke,
                              }}
                              aria-hidden
                            />
                            <span className={styles.legendText}>
                              {currentData.state}-{district}
                            </span>
                          </li>
                        );
                      })}
                </ul>
              </aside>
            </div>
          </div>
          <Refine
            multipleDistricts={data.houseReps.length > 1}
            onRefineSuccess={(payload) => {
              setCurrentData(payload.data);
              setCurrentCityStateLabel(payload.cityStateLabel);
              setCurrentDistrictGeoJson(payload.districtGeoJson);
              setCurrentMapFallback(payload.mapFallback);
            }}
          />
        </section>
      </main>
      <Banner />
      <section className={styles.levelToggleSection} aria-label="Choose representative level">
        <div className={styles.levelToggle}>
          <button
            type="button"
            className={
              activeLevel === "federal"
                ? `${styles.levelButton} ${styles.levelButtonActive}`
                : styles.levelButton
            }
            onClick={() => setActiveLevel("federal")}
          >
            Federal
          </button>
          <button
            type="button"
            className={
              activeLevel === "state"
                ? `${styles.levelButton} ${styles.levelButtonActive}`
                : styles.levelButton
            }
            onClick={() => setActiveLevel("state")}
          >
            State
          </button>
        </div>
      </section>
      <div>
        {activeLevel === "federal" ? (
          <RepsWrapper
            repsData={currentData}
            districtColorByDistrict={districtColorByDistrict}
          />
        ) : (
          <StateLegislatorList
            stateAbbrev={currentData.state}
            members={currentData.stateLegislators}
          />
        )}
      </div>
    </>
  );
}

function StateLegislatorList({
  stateAbbrev,
  members,
}: {
  stateAbbrev: string;
  members: StateLegislator[];
}) {
  if (!members.length) {
    return (
      <section className={styles.stateSection}>
        <p className={styles.stateEmpty}>
          State legislators are unavailable for this address right now.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.stateSection}>
      <div className={styles.stateHeading}>{stateAbbrev} State Legislature</div>
      <div className={styles.stateGrid}>
        <div className={styles.stateHeader} role="row" aria-label="State Columns">
          <span>Name</span>
          <span>Chamber</span>
          <span>District</span>
          <span>Party</span>
          <span>Link</span>
        </div>
        {members.map((m) => (
          <div key={m.id} className={styles.stateRow}>
            <span className={styles.stateName}>{m.full_name}</span>
            <span>{m.chamber}</span>
            <span>{m.district}</span>
            <span>{m.party || "Unknown"}</span>
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.stateLink}
            >
              Profile
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
