import { notFound } from "next/navigation";
import Address from "@/app/components/address/address";
import CityStateLabel from "@/app/components/cityStateLabel/cityStateLabel";
import styles from "@/app/reps/[zip]/repsPageClient.module.scss";
import {
  cityStateLabelFromGeocode,
  getCoordinates,
} from "@/app/lib/util";

type Props = { params: Promise<{ zip: string }> };

/**
 * Renders the reps page address + city/state header in the same centered
 * 70vw column as {@link RepsPageClient} (see `.headerSection` in repsPageClient.module.scss).
 */
export default async function HeaderWrapper({ params }: Props) {
  const { zip } = await params;
  const geo = await getCoordinates(zip);
  if (!geo || !geo.results?.[0]) notFound();
  const location = geo.results[0];
  const label = cityStateLabelFromGeocode(location);

  return (
    <section
      className={styles.headerSection}
      aria-label="Location for these results"
    >
      <header className={styles.header}>
        <Address address={zip} />
        <CityStateLabel label={label} />
      </header>
    </section>
  );
}
