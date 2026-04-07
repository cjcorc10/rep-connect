import { notFound } from "next/navigation";
import { getRepsByAddress } from "@/app/lib/reps";
import RepsPageClient from "@/app/reps/[zip]/repsPageClient";

type Props = {
  params: Promise<{ zip: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { zip } = await params;
  const query = await searchParams;
  const street =
    typeof query.street === "string" ? query.street : undefined;
  const address = street ? `${street}, ${zip}` : zip;

  const payload = await getRepsByAddress(address, zip);
  if (!payload) notFound();

  return (
    <RepsPageClient
      zipFromRoute={zip}
      data={payload.data}
      cityStateLabel={payload.cityStateLabel}
      districtGeoJson={payload.districtGeoJson}
      mapFallback={payload.mapFallback}
    />
  );
}
