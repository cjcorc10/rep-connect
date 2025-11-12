import { getCoordinates, getDistricts } from '../lib/util';
import SenateContainer from './senateContainer';
import HouseContainer from './houseContainer';
import { notFound } from 'next/navigation';
import { getHouseReps, getSenators } from '../lib/db';
import RepCard from './repCard';
import { Rep } from '../lib/definitions';

export default async function RepFetchWrapper({
  addressPromise,
}: {
  addressPromise: Promise<string>;
}) {
  const address = await addressPromise;
  const geo = await getCoordinates(address);
  console.log('Geocoding result:', geo);

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

  const houseRepsInitial = (await getHouseReps(
    districts,
    state
  )) as Rep[];
  const senateReps = await getSenators(state);

  return (
    <div>
      <SenateContainer state={state}>
        {senateReps.map((senator) => (
          <RepCard key={senator.bioguide_id} rep={senator} />
        ))}
      </SenateContainer>
      <HouseContainer initialReps={houseRepsInitial} />
    </div>
  );
}
