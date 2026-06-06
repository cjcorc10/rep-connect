import { colorToGradiant, RepRosterRow } from "@/app/lib/repRoster";
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

  const gradient = colorToGradiant(
    row.districtColorFill || `#4e9bff`,
  );

  return (
    <>
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
    </>
  );
};
