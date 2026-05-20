import type { RepRosterRow } from "@/app/lib/repRoster";
import styles from "./roster.module.scss";

type RosterProps = {
  rows: RepRosterRow[];
  onClickRow: (row: RepRosterRow) => void;
};

export const Roster = ({ rows, onClickRow }: RosterProps) => {
  const numReps = rows.length;

  return (
    <div className={styles.roster}>
      <RosterColumnHeader />
      {rows.map((row, index) => (
        <div key={row.id}>
          <RosterRow row={row} />
          {index !== numReps - 1 && (
            <div className={styles.rosterRowSeparator} />
          )}
        </div>
      ))}
    </div>
  );
};

const RosterRow = ({ row }: { row: RepRosterRow }) => {
  return (
    <div className={styles.rosterRow}>
      <h1 className={styles.repName}>{row.shortName}</h1>
      <div className={styles.keyGroup}>
        <h3 className={styles.rosterColumnValue}>{row.chamber}</h3>
        <h3 className={styles.rosterColumnValue}>{row.district}</h3>
        <h3 className={styles.rosterColumnValue}>
          {row.termEndDisplay}
        </h3>
      </div>
    </div>
  );
};

const RosterColumnHeader = () => {
  return (
    <div className={styles.rosterColumnHeader}>
      <span className={styles.rosterColumnKey}>Name</span>
      <div className={styles.keyGroup}>
        <span className={styles.rosterColumnKey}>Chamber</span>
        <span className={styles.rosterColumnKey}>District</span>
        <span className={styles.rosterColumnKey}>Term</span>
      </div>
    </div>
  );
};
