import {
  cityStateLabelFromGeocode,
  getCoordinates,
} from "@/app/lib/util";
import { notFound } from "next/navigation";
import { getRepsByLocationQuery } from "@/app/lib/reps";
import RepsPageClient from "./repsPageClient";
import Loading from "../../components/loading/loading";
import { Suspense } from "react";
type PageProps = {
  params: Promise<{ zip: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncPage params={params} />
    </Suspense>
  );
}

const AsyncPage = async ({
  params,
}: {
  params: Promise<{ zip: string }>;
}) => {
  const { zip } = await params;
  const coordinates = await getCoordinates(zip);
  if (!coordinates) notFound();
  const label = cityStateLabelFromGeocode(coordinates);
  const payload = await getRepsByLocationQuery(coordinates);
  if (!payload) notFound();
  return <RepsPageClient payload={payload} zip={zip} label={label} />;
};
