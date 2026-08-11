import { cityStateLabelFromGeocode } from "@/app/lib/util";
import { getCoordinates } from "@/app/lib/util";
import { getRepsByLocationQuery } from "@/app/lib/reps";
import { notFound } from "next/navigation";
import RepsPageClient from "./repsPageClient";
import { RouteWrapper } from "@/app/components/transitionComponents/routeWrapper";

export const AsyncPage = async ({
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

  return (
    <RouteWrapper>
      <RepsPageClient payload={payload} zip={zip} label={label} />
    </RouteWrapper>
  );
};
