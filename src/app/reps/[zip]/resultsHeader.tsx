"use client";
import Address from "@/app/components/address/address";
import CityStateLabel from "@/app/components/cityStateLabel/cityStateLabel";
import styles from "@/app/reps/[zip]/repsPageClient.module.scss";

type ResultsHeaderProps = {
  zip: string;
  label: string;
};

export default function ResultsHeader({
  zip,
  label,
}: ResultsHeaderProps) {
  return (
    <header className={styles.resultsHeader}>
      <Address address={zip} />
      <CityStateLabel label={label} />
    </header>
  );
}
