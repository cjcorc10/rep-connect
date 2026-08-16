import { RepRosterRow } from "@/app/lib/repRoster";
import styles from "./roster.module.scss";

export const RosterRow = ({
  row,
  isFederal,
}: {
  row: RepRosterRow;
  isFederal: boolean;
}) => {
  const date = new Date(row.termEndDisplay);
  const year = date.getFullYear();

  return (
    <>
      <h1 className={styles.repName}>{row.shortName}</h1>
      <div className={styles.mobileColumnGroup}>
        <a
          href={`tel:${row.phone?.replace(/\D/g, "")}`}
          className={styles.mobileColumnValue}
        >
          Call
        </a>
        <h3 className={styles.mobileColumnValue}>Details</h3>
      </div>
      <div className={styles.keyGroup}>
        <h3 className={styles.rosterColumnValue}>{row.chamber}</h3>
        <h3 className={styles.rosterColumnValue}>{row.district}</h3>
        {isFederal && (
          <h3 className={styles.rosterColumnValue}>{year}</h3>
        )}
      </div>
    </>
  );
};
