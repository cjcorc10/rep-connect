import { getCoordinates, getDistricts } from '../lib/util';
import SenateContainer from './senateContainer';
import HouseContainer from './houseContainer';

export default async function RepFetchWrapper({
  addressPromise,
}: {
  addressPromise: Promise<string>;
}) {
  const address = await addressPromise;
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
