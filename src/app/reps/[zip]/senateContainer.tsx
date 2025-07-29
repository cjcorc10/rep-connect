import { getSenatorImage, getSenators } from "@/app/lib/actions";

type SenateContainerProps = {
  state: string;
};

export default async function SenateContainer({ state }: SenateContainerProps) {
  const senators = await getSenators(state);
  const senatorImages = await Promise.all(
    senators.map((senator) => getSenatorImage(senator.id))
  );
  return (
    <div>
      <h2>Senate:</h2>
    </div>
  );
}
