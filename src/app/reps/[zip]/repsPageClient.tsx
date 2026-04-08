"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import Address from "@/app/components/address/address";
import RepsWrapper from "@/app/components/repsWrapper/repsWrapper";
import RepRoster from "@/app/components/repsWrapper/RepRoster";
import type {
  Coordinates,
  DistrictMapFeatureCollection,
  Rep,
  RepsData,
  StateDistrict,
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
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import styles from "./repsPageClient.module.scss";
import Refine from "@/app/components/refine/refine";
import { stateLegislatorsToRosterRows } from "@/app/lib/repRoster";

/** Strip leading zeros from numeric state district ids (e.g. "025" → "25"). */
function formatStateDistrictDisplay(district: string): string {
  const t = district.trim();
  if (!t) return t;
  if (/^\d+$/.test(t)) {
    return String(parseInt(t, 10));
  }
  return t;
}

function districtsMatch(a: string, b: string): boolean {
  const x = a.trim();
  const y = b.trim();
  if (x === y) return true;
  if (/^\d+$/.test(x) && /^\d+$/.test(y)) {
    return parseInt(x, 10) === parseInt(y, 10);
  }
  return false;
}

function lastNameFromFullName(name: string): string {
  const t = name.trim();
  if (!t) return "";
  const parts = t.split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1]! : "";
}

function federalHouseLastName(houseReps: Rep[], district: string): string {
  const rep = houseReps.find((h) =>
    districtsMatch(String(h.district), String(district)),
  );
  return rep?.last_name?.trim() ?? "";
}

function stateLegislatorLastName(
  members: StateLegislator[],
  chamberKey: StateLegislator["chamberKey"],
  district: string,
): string {
  const m = members.find(
    (x) => x.chamberKey === chamberKey && districtsMatch(x.district, district),
  );
  return m ? lastNameFromFullName(m.full_name) : "";
}

/** ArcGIS envelope can return many districts; keep rows that match a people.geo legislator. */
function stateDistrictHasLegislator(
  d: StateDistrict,
  legislators: StateLegislator[],
): boolean {
  if (!legislators.length) return true;
  return legislators.some(
    (m) =>
      m.chamberKey === d.chamberKey &&
      districtsMatch(m.district, d.district),
  );
}

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

  const alignedStateDistricts = useMemo(() => {
    const all = currentData.stateDistricts;
    const legs = currentData.stateLegislators;
    if (!legs.length) return all;
    const matched = all.filter((d) => stateDistrictHasLegislator(d, legs));
    return matched.length > 0 ? matched : all;
  }, [currentData.stateDistricts, currentData.stateLegislators]);

  const alignedStateDistrictGeoJson = useMemo(() => {
    const geo = currentData.stateDistrictGeoJson;
    if (!geo?.features?.length) return geo;
    const legs = currentData.stateLegislators;
    if (!legs.length) return geo;

    const allowed = new Set(alignedStateDistricts.map((d) => d.mapKey));
    const features = geo.features.filter((f) =>
      allowed.has(String(f.properties?.mapKey ?? "")),
    );
    if (features.length === 0) return geo;
    return { type: "FeatureCollection" as const, features };
  }, [
    currentData.stateDistrictGeoJson,
    currentData.stateLegislators,
    alignedStateDistricts,
  ]);

  const stateDistrictRankByMapKey = useMemo(() => {
    const rankByKey = new Map<string, number>();
    const stateGeo = alignedStateDistrictGeoJson;
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
  }, [alignedStateDistrictGeoJson]);

  const stateSenateDistricts = useMemo(
    () =>
      alignedStateDistricts.filter((d) => d.chamberKey === "upper"),
    [alignedStateDistricts],
  );

  const stateHouseDistricts = useMemo(
    () =>
      alignedStateDistricts.filter((d) => d.chamberKey === "lower"),
    [alignedStateDistricts],
  );

  const activeDistrictGeoJson =
    activeLevel === "state"
      ? alignedStateDistrictGeoJson
      : currentDistrictGeoJson;

  const stateRosterRows = useMemo(
    () => stateLegislatorsToRosterRows(currentData.stateLegislators),
    [currentData.stateLegislators],
  );

  return (
    <>
      <main
        className={clsx(
          "py-4 sm:py-6 h-[100vh] relative flex flex-col items-center justify-center",
          styles.main,
        )}
      >
        <div
          className={styles.folderTabs}
          role="tablist"
          aria-label="Representative level"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeLevel === "federal"}
            className={clsx(
              styles.levelButton,
              activeLevel === "federal" && styles.levelButtonActive,
            )}
            onClick={() => setActiveLevel("federal")}
          >
            Federal
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeLevel === "state"}
            className={clsx(
              styles.levelButton,
              activeLevel === "state" && styles.levelButtonActive,
            )}
            onClick={() => setActiveLevel("state")}
          >
            State
          </button>
        </div>
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
                {activeLevel === "federal" ? (
                  <>
                    <h3 className={styles.legendSubheader}>Federal</h3>
                    <ul className={styles.legendList}>
                      {currentData.districts.map((district, i) => {
                        const rank =
                          districtRankByLabel.get(String(district)) ?? i;
                        const color = paletteForDistrictRank(rank);
                        const last = federalHouseLastName(
                          currentData.houseReps,
                          String(district),
                        );
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
                              {district}
                              {last ? (
                                <>
                                  {" "}
                                  <span className={styles.legendLastName}>
                                    {last}
                                  </span>
                                </>
                              ) : null}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <>
                    {stateSenateDistricts.length > 0 ? (
                      <section
                        className={styles.legendChamber}
                        aria-label="State Senate districts"
                      >
                        <h3 className={styles.legendChamberTitle}>
                          State Senate
                        </h3>
                        <ul className={styles.legendList}>
                          {stateSenateDistricts.map((d, i) => {
                            const rank =
                              stateDistrictRankByMapKey.get(d.mapKey) ?? i;
                            const color = paletteForDistrictRank(rank);
                            const last = stateLegislatorLastName(
                              currentData.stateLegislators,
                              "upper",
                              d.district,
                            );
                            return (
                              <li
                                key={`${d.mapKey}-sen-${i}`}
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
                                  {formatStateDistrictDisplay(d.district)}
                                  {last ? (
                                    <>
                                      {" "}
                                      <span className={styles.legendLastName}>
                                        {last}
                                      </span>
                                    </>
                                  ) : null}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ) : null}
                    {stateHouseDistricts.length > 0 ? (
                      <section
                        className={styles.legendChamber}
                        aria-label="State House districts"
                      >
                        <h3 className={styles.legendChamberTitle}>
                          State House
                        </h3>
                        <ul className={styles.legendList}>
                          {stateHouseDistricts.map((d, i) => {
                            const rank =
                              stateDistrictRankByMapKey.get(d.mapKey) ?? i;
                            const color = paletteForDistrictRank(rank);
                            const last = stateLegislatorLastName(
                              currentData.stateLegislators,
                              "lower",
                              d.district,
                            );
                            return (
                              <li
                                key={`${d.mapKey}-house-${i}`}
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
                                  {formatStateDistrictDisplay(d.district)}
                                  {last ? (
                                    <>
                                      {" "}
                                      <span className={styles.legendLastName}>
                                        {last}
                                      </span>
                                    </>
                                  ) : null}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ) : null}
                  </>
                )}
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
      <div>
        {activeLevel === "federal" ? (
          <RepsWrapper
            repsData={currentData}
            districtColorByDistrict={districtColorByDistrict}
          />
        ) : (
          <RepRoster
            rows={stateRosterRows}
            onRowDetails={(row) => {
              if (row.externalUrl) {
                window.open(
                  row.externalUrl,
                  "_blank",
                  "noopener,noreferrer",
                );
              }
            }}
            emptyMessage="State legislators are unavailable for this address right now."
          />
        )}
      </div>
    </>
  );
}
