"use client";

import DistrictMap from "@/app/components/districtMap/districtMap";
import Address from "@/app/components/address/address";
import RepsWrapper from "@/app/components/repsWrapper/repsWrapper";
import RepRoster from "@/app/components/repsWrapper/RepRoster";
import type {
  Coordinates,
  DistrictMapFeatureCollection,
  Rep,
  RepsByAddressPayload,
  RepsData,
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
import {
  federalHouseLastName,
  formatStateDistrictDisplay,
  stateDistrictHasLegislator,
  stateLegislatorLastName,
} from "./repsPageClient.helpers";

type Props = {
  zip: string;
  payload: RepsByAddressPayload;
};

// Main client page: controls level toggle, map/legend, and roster rendering.
export default function RepsPageClient({
  zip,
  payload,
}: Props) {
  const { data, cityStateLabel, districtGeoJson, mapFallback } = payload;
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

  // Sync local UI state when fresh server props arrive.
  useEffect(() => {
    setCurrentData(data);
    setCurrentCityStateLabel(cityStateLabel);
    setCurrentDistrictGeoJson(districtGeoJson);
    setCurrentMapFallback(mapFallback);
  }, [data, cityStateLabel, districtGeoJson, mapFallback]);

  // Keep rep detail store in sync with current federal reps.
  useEffect(() => {
    setReps(
      currentData.senateReps.concat(currentData.houseReps) as Rep[]
    );
  }, [currentData.houseReps, currentData.senateReps, setReps]);

  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapsMapId =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  // Build a stable style-rank lookup for federal district labels.
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

  // Assign map-derived colors per federal district for table display.
  const districtColorByDistrict = useMemo(() => {
    const out: Record<string, { fill: string; stroke: string }> = {};
    currentData.districts.forEach((district, i) => {
      const rank = districtRankByLabel.get(String(district)) ?? i;
      out[String(district)] = paletteForDistrictRank(rank);
    });
    return out;
  }, [currentData.districts, districtRankByLabel]);

  // Filter state districts to the ones that match returned legislators.
  const alignedStateDistricts = useMemo(() => {
    const all = currentData.stateDistricts;
    const legs = currentData.stateLegislators;
    if (!legs.length) return all;
    const matched = all.filter((d) => stateDistrictHasLegislator(d, legs));
    return matched.length > 0 ? matched : all;
  }, [currentData.stateDistricts, currentData.stateLegislators]);

  // Filter state district geojson to keep map and legend in sync.
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

  // Build style-rank lookup for state map keys.
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

  // Split state districts by chamber for grouped legend sections.
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

  // Convert state legislators to shared roster-row shape.
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
        {/* Federal/state level tabs */}
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
        {/* Header, map canvas, legend, and refine controls */}
        <section className={styles.headerSection}>
          <header className={styles.header}>
            <div className={styles.addressContainer}>
              <h1>Showing results for</h1>
              <Address address={zip} compact />
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
                  mapId={mapsMapId}
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
      {/* Federal detail drawer path or state roster path */}
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
