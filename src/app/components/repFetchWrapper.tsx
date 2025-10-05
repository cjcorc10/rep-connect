import { getCoordinates, getDistricts } from '../lib/util';
import SenateContainer from './senateContainer';
import HouseContainer from './houseContainer';
import { notFound } from 'next/navigation';

export default async function RepFetchWrapper({
  addressPromise,
}: {
  addressPromise: Promise<string>;
}) {
  const address = await addressPromise;
  const geo = await getCoordinates(address);

  const ok =
    geo &&
    geo.status === 'OK' &&
    geo.results &&
    geo.results.length > 0;

  if (!ok) {
    notFound();
  }

  const { northeast, southwest } = geo!.results[0].geometry.bounds;

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
