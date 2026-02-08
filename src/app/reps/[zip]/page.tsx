import { notFound } from "next/navigation";
import { getRepsByAddress } from "@/app/lib/reps";
import RepsPageClient from "./repsPageClient";

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

  const data = await getRepsByAddress(address);
  if (!data) notFound();

  return <RepsPageClient address={address} data={data} />;
}
