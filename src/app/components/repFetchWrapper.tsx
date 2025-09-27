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
