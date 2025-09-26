import { getCoordinates, getDistricts } from '../lib/util';
import SenateContainer from '../reps/[zip]/senateContainer';
import HouseContainer from '../reps/[zip]/houseContainer';
type WrapperProps = {
  address: string;
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function RepFetchWrapper({
  address,
}: WrapperProps) {
  await sleep(2000);
  const { northeast, southwest } = await getCoordinates(address);
  const { state, districts } = await getDistricts({
    northeast,
    southwest,
  });
  return (
    <div>
      <SenateContainer state={state} />
      <HouseContainer districts={districts} state={state} />
    </div>
  );
}
