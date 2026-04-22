import { notFound } from "next/navigation";
import { getRepsByLocationQuery } from "@/app/lib/reps";
import RepsPageClient from "@/app/reps/[zip]/repsPageClient";
import {
  cityStateLabelFromGeocode,
  getCoordinates,
} from "@/app/lib/util";
import type { RepsByAddressPayload } from "@/app/lib/definitions";

type Props = {
  params: Promise<{ zip: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page({ params }: Props) {
  const { zip } = await params;
  const geo = await getCoordinates(zip);
  if (!geo || !geo.results?.[0]) notFound();
  const location = geo.results[0];

  const core = await getRepsByLocationQuery(location);
  if (!core) notFound();

  const cityStateLabel = cityStateLabelFromGeocode(location);
  const payload: RepsByAddressPayload = { ...core, cityStateLabel };

  return <RepsPageClient zip={zip} payload={payload} />;
}
