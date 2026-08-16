import styles from "./roster.module.scss";
export const RosterColumnHeader = ({
  isFederal,
}: {
  isFederal: boolean;
}) => {
  return (
    <div className={styles.rosterColumnHeader}>
      <div className={styles.desktopColumnGroup}>
        <span className={styles.rosterColumnKey}>Name</span>
        <div className={styles.keyGroup}>
          <span className={styles.rosterColumnKey}>Chamber</span>
          <span className={styles.rosterColumnKey}>District</span>
          {isFederal && (
            <span className={styles.rosterColumnKey}>Term</span>
          )}
        </div>
      </div>
      <div className={styles.mobileColumnGroup}>
        <span className={styles.mobileColumnKey}>
          Representatives
        </span>
      </div>
    </div>
  );
};
