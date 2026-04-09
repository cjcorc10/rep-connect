import { notFound } from "next/navigation";
import { getRepsByLocationQuery } from "@/app/lib/reps";
import RepsPageClient from "@/app/reps/[zip]/repsPageClient";

type Props = {
  params: Promise<{ zip: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page({ params }: Props) {
  const { zip } = await params;
  const payload = await getRepsByLocationQuery(zip);
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
