"use client";
import styles from "@/app/reps/[zip]/repsPageClient.module.scss";
import type { Refine } from "@/app/lib/definitions";

type ResultsHeaderProps = {
  zip: string;
  label: string;
  refine: Refine;
};

export default function ResultsHeader({
  zip,
  label,
  refine,
}: ResultsHeaderProps) {
  return (
    <header className={styles.resultsHeader}>
      <div className={styles.zip}>
        <p className={styles.zipLabel}>ZIP</p>
        <h3 className={styles.zipText}>{zip}</h3>
      </div>
      {refine.multipleDistricts && (
        <div className={styles.refineText}>
          <p>
            Multiple districts were returned. Select refine to refine
            your search or select from the results below.
          </p>
        </div>
      )}
      <div className={styles.cityState}>
        <p className={styles.cityStateLabel}>City</p>
        <p className={styles.cityStateText}>{label}</p>
      </div>
    </header>
  );
}
