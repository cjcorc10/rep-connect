"use client";

import type { Legend } from "@/app/lib/definitions";
import {
  districtsMatch,
  formatStateDistrictDisplay,
} from "@/app/reps/[zip]/helper";
import { lookupFederalLegendFill } from "@/app/reps/[zip]/derivation";
import styles from "./districtMapLegend.module.scss";

type Swatch = { fill: string; stroke: string };

const FALLBACK_SWATCH: Swatch = {
  fill: "#888888",
  stroke: "#888888",
};

function toSwatch(fill: string | undefined): Swatch {
  if (!fill) return FALLBACK_SWATCH;
  return { fill, stroke: fill };
}

function LegendEntry({
  swatch,
  primaryLabel,
  fullName,
}: {
  swatch: Swatch;
  primaryLabel: string;
  fullName: string;
}) {
  return (
    <li className={styles.legendItem}>
      <div className={styles.legendText}>
        <div
          className={styles.districtBadge}
          style={{ background: swatch.fill }}
        >
          <span className={styles.districtNumber}>
            {primaryLabel}
          </span>
        </div>{" "}
        <span className={styles.legendName}>{fullName}</span>
      </div>
    </li>
  );
}

export type DistrictMapLegendFederalSlice = Legend["federal"];
export type DistrictMapLegendStateSlice = Legend["state"];
export type DistrictMapLegendProps = Legend;

export default function DistrictMapLegend({
  level,
  stateCode,
  federal,
  state: stateSlice,
}: DistrictMapLegendProps) {
  const { districts, houseReps, districtColorFillByLabel } = federal;
  const {
    stateSenateDistricts,
    stateHouseDistricts,
    stateLegislators,
    districtColorFillByMapKey,
  } = stateSlice;

  return (
    <aside className={styles.legend} aria-label="District legend">
      {level === "federal" ? (
        <div className={styles.legendContainer}>
          <h3 className={styles.legendSubheader}>
            House of Representatives
          </h3>
          <ul className={styles.legendList}>
            {districts.map((district) => {
              const rep = houseReps.find((houseRep) =>
                districtsMatch(
                  String(houseRep.district),
                  String(district),
                ),
              );
              if (!rep) return null;

              const fill = lookupFederalLegendFill(
                String(rep.district),
                districtColorFillByLabel,
              );
              const fullName = rep.full_name;
              return (
                <LegendEntry
                  key={`${stateCode}-${district}-${rep.bioguide_id}`}
                  swatch={toSwatch(fill)}
                  primaryLabel={String(district)}
                  fullName={fullName}
                />
              );
            })}
          </ul>
        </div>
      ) : (
        <>
          {stateSenateDistricts.length > 0 ? (
            <div className={styles.legendContainer}>
              <h3 className={styles.legendSubheader}>Senate</h3>
              <ul className={styles.legendList}>
                {stateSenateDistricts.map((d, i) => {
                  const fill = districtColorFillByMapKey.get(
                    d.mapKey,
                  );
                  const fullName = stateLegislators[i].full_name;
                  return (
                    <LegendEntry
                      key={`${d.mapKey}-sen-${i}`}
                      swatch={toSwatch(fill)}
                      primaryLabel={formatStateDistrictDisplay(
                        d.district,
                      )}
                      fullName={fullName}
                    />
                  );
                })}
              </ul>
            </div>
          ) : null}
          {stateHouseDistricts.length > 0 ? (
            <div className={styles.legendContainer}>
              <h3 className={styles.legendSubheader}>House</h3>
              <ul className={styles.legendList}>
                {stateHouseDistricts.map((d, i) => {
                  const senateOffset = stateSenateDistricts.length;
                  const fill = districtColorFillByMapKey.get(
                    d.mapKey,
                  );
                  const fullName =
                    stateLegislators[senateOffset + i].full_name;
                  return (
                    <LegendEntry
                      key={`${d.mapKey}-house-${i}`}
                      swatch={toSwatch(fill)}
                      primaryLabel={formatStateDistrictDisplay(
                        d.district,
                      )}
                      fullName={fullName}
                    />
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </aside>
  );
}
