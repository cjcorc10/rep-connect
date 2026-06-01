"use client";
import {
  colorToGradiant,
  type RepRosterRow,
} from "@/app/lib/repRoster";
import styles from "./roster.module.scss";
import { useRef, useState } from "react";
import { FloatingCarousel } from "../floatingCarousel/floatingCarousel";

type RosterProps = {
  rows: RepRosterRow[];
  onClickRow: (row: RepRosterRow) => void;
  repMap: Map<string, string>;
  isFederal: boolean;
};

export const Roster = ({
  rows,
  onClickRow,
  repMap,
  isFederal,
}: RosterProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const rosterRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.roster}
      ref={rosterRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FloatingCarousel
        areaRef={rosterRef}
        isHovered={isHovered}
        repMap={repMap}
        hoveredIndex={hoveredIndex}
      />
      <RosterColumnHeader isFederal={isFederal} />
      {rows.map((row, index) => (
        <div key={row.id} onMouseEnter={() => setHoveredIndex(index)}>
          <RosterRow row={row} isFederal={isFederal} />
          {index !== rows.length - 1 && (
            <div className={styles.rosterRowSeparator} />
          )}
        </div>
      ))}
    </div>
  );
};

const RosterRow = ({
  row,
  isFederal,
}: {
  row: RepRosterRow;
  isFederal: boolean;
}) => {
  const date = new Date(row.termEndDisplay);
  const year = date.getFullYear();

  const gradient = colorToGradiant(
    row.districtColorFill || `#4e9bff`,
  );

  return (
    <div className={styles.rosterRow}>
      <h1 className={styles.repName}>{row.shortName}</h1>
      <div className={styles.keyGroup}>
        <h3 className={styles.rosterColumnValue}>{row.chamber}</h3>
        <h3
          className={styles.rosterColumnValue}
          style={{
            background: gradient,
          }}
        >
          {row.district}
        </h3>
        {isFederal && (
          <h3 className={styles.rosterColumnValue}>{year}</h3>
        )}
      </div>
    </div>
  );
};

const RosterColumnHeader = ({
  isFederal,
}: {
  isFederal: boolean;
}) => {
  return (
    <div className={styles.rosterColumnHeader}>
      <span className={styles.rosterColumnKey}>Name</span>
      <div className={styles.keyGroup}>
        <span className={styles.rosterColumnKey}>Chamber</span>
        <span className={styles.rosterColumnKey}>District</span>
        {isFederal && (
          <span className={styles.rosterColumnKey}>Term</span>
        )}
      </div>
    </div>
  );
};
