"use client";

import type { Legend } from "@/app/lib/definitions";
import {
  districtsMatch,
  formatStateDistrictDisplay,
} from "@/app/reps/[zip]/helper";
import { lookupFederalLegendFill } from "@/app/reps/[zip]/derivation";
import styles from "./districtMapLegend.module.scss";

function LegendEntry({
  primaryLabel,
  fullName,
}: {
  primaryLabel: string;
  fullName: string;
}) {
  return (
    <li className={styles.legendItem}>
      <span className={styles.legendName}>{fullName}</span>
      <span className={styles.districtNumber}>{primaryLabel}</span>
      <div className={styles.underLine} />
      <div className={styles.rowFill} />
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
  const {
    districts,
    houseReps,
    senateReps,
    districtColorFillByLabel,
  } = federal;
  const {
    stateSenateDistricts,
    stateHouseDistricts,
    stateLegislators,
    districtColorFillByMapKey,
  } = stateSlice;

  return (
    <aside className={styles.legend} aria-label="District legend">
      {level === "federal" ? (
        <>
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
                    primaryLabel={String(district)}
                    fullName={fullName}
                  />
                );
              })}
            </ul>
          </div>
          {senateReps.length > 0 ? (
            <div className={styles.legendContainer}>
              <h3 className={styles.legendSubheader}>Senate</h3>
              <ul className={styles.legendList}>
                {senateReps.map((rep) => (
                  <LegendEntry
                    key={`${stateCode}-sen-${rep.bioguide_id}`}
                    primaryLabel={rep.state}
                    fullName={rep.full_name}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </>
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
