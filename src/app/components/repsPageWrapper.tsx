import RepsPageClient from "../reps/[zip]/repsPageClient";
import { getCoordinates } from "../lib/util";
import { notFound } from "next/navigation";
import { getRepsByLocationQuery } from "../lib/reps";

async function RepsPageWrapper({
  params,
}: {
  params: Promise<{ zip: string }>;
}) {
  const { zip } = await params;
  const geo = await getCoordinates(zip);
  if (!geo || !geo.results?.[0]) notFound();
  const location = geo.results[0];
  const payload = await getRepsByLocationQuery(location);
  if (!payload) notFound();

  return <RepsPageClient payload={payload} />;
}

export default RepsPageWrapper;
