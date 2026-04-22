"use client";

import type { Rep, StateDistrict, StateLegislator } from "@/app/lib/definitions";
import { paletteForDistrictRank } from "@/app/lib/districtMapStyles";
import {
  federalHouseLastName,
  formatStateDistrictDisplay,
  stateLegislatorLastName,
} from "@/app/reps/[zip]/repsPageClient.helpers";
import styles from "./districtMapLegend.module.scss";

type Swatch = { fill: string; stroke: string };

function LegendEntry({
  swatch,
  primaryLabel,
  lastName,
}: {
  swatch: Swatch;
  primaryLabel: string;
  lastName: string | null;
}) {
  return (
    <li className={styles.legendItem}>
      <span
        className={styles.legendSwatch}
        style={{
          backgroundColor: swatch.fill,
          borderColor: swatch.stroke,
        }}
        aria-hidden
      />
      <span className={styles.legendText}>
        {primaryLabel}
        {lastName ? (
          <>
            {" "}
            <span className={styles.legendLastName}>{lastName}</span>
          </>
        ) : null}
      </span>
    </li>
  );
}

export type DistrictMapLegendFederalSlice = {
  districts: string[];
  houseReps: Rep[];
  districtRankByLabel: Map<string, number>;
};

export type DistrictMapLegendStateSlice = {
  stateSenateDistricts: StateDistrict[];
  stateHouseDistricts: StateDistrict[];
  stateDistrictRankByMapKey: Map<string, number>;
  stateLegislators: StateLegislator[];
};

export type DistrictMapLegendProps = {
  level: "federal" | "state";
  stateCode: string;
  federal: DistrictMapLegendFederalSlice;
  state: DistrictMapLegendStateSlice;
};

export default function DistrictMapLegend({
  level,
  stateCode,
  federal,
  state: stateSlice,
}: DistrictMapLegendProps) {
  const {
    districts,
    houseReps,
    districtRankByLabel,
  } = federal;
  const {
    stateSenateDistricts,
    stateHouseDistricts,
    stateDistrictRankByMapKey,
    stateLegislators,
  } = stateSlice;
  return (
    <aside className={styles.legend} aria-label="District legend">
      <h2 className={styles.legendTitle}>Districts</h2>

      {level === "federal" ? (
        <>
          <h3 className={styles.legendSubheader}>Federal</h3>
          <ul className={styles.legendList}>
            {districts.map((district, i) => {
              const rank =
                districtRankByLabel.get(String(district)) ?? i;
              const color = paletteForDistrictRank(rank);
              const last = federalHouseLastName(
                houseReps,
                String(district),
              );
              return (
                <LegendEntry
                  key={`${stateCode}-${district}-${i}`}
                  swatch={color}
                  primaryLabel={String(district)}
                  lastName={last || null}
                />
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
                    stateLegislators,
                    "upper",
                    d.district,
                  );
                  return (
                    <LegendEntry
                      key={`${d.mapKey}-sen-${i}`}
                      swatch={color}
                      primaryLabel={formatStateDistrictDisplay(
                        d.district,
                      )}
                      lastName={last || null}
                    />
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
                    stateLegislators,
                    "lower",
                    d.district,
                  );
                  return (
                    <LegendEntry
                      key={`${d.mapKey}-house-${i}`}
                      swatch={color}
                      primaryLabel={formatStateDistrictDisplay(
                        d.district,
                      )}
                      lastName={last || null}
                    />
                  );
                })}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </aside>
  );
}
