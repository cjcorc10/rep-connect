import { getCoordinates, getDistricts } from '../lib/util';
import SenateContainer from './senateContainer';
import HouseContainer from './houseContainer';
type WrapperProps = {
  address: string;
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default async function RepFetchWrapper({
  address,
}: WrapperProps) {
  //   await sleep(10000);
  const data = await getCoordinates(address);
  const { northeast, southwest } = data!.results[0].geometry.bounds;

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
