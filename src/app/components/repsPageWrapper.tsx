import RepsPageClient from "../reps/[zip]/repsPageClient";
import { getCoordinates } from "../lib/util";
import { notFound } from "next/navigation";
import { getRepsByLocationQuery } from "../lib/reps";

export default async function RepsPageWrapper({params}: {
  params: Promise<{zip: string}>}) {
  const {zip} = await params;
  const coordinates = await getCoordinates(zip);
  if (!coordinates) notFound();
  const payload = await getRepsByLocationQuery(coordinates);
  if (!payload) notFound();

  return <RepsPageClient payload={payload} />;
}