import {
  RepRosterRow,
  termEndsAtNextMidterm,
} from "@/app/lib/repRoster";
import styles from "./roster.module.scss";

export const RosterRow = ({
  row,
  index,
  isFederal,
}: {
  row: RepRosterRow;
  index: number;
  isFederal: boolean;
}) => {
  const date = new Date(row.termEndDisplay);
  const year = date.getFullYear();
  const isTermEnding = termEndsAtNextMidterm(date);

  return (
    <>
      <div className={styles.underLine} />
      <h1 className={styles.repName}>{row.shortName}</h1>
      <p className={styles.repDetails}>Details</p>
      <div className={styles.keyGroup}>
        <h3 className={styles.rosterColumnValue}>{row.chamber}</h3>
        <h3 className={styles.rosterColumnValue}>{row.district}</h3>
        {isFederal && (
          <h3
            className={`${styles.rosterColumnValue} ${isTermEnding ? styles.termEnding : ""}`}
          >
            {year}
          </h3>
        )}
      </div>
    </>
  );
};
