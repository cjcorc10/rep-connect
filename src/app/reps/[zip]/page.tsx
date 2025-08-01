import { getCoordinates, getDistricts } from '@/app/lib/util';
import HouseContainer from './houseContainer';
import SenateContainer from './senateContainer';
import { Suspense } from 'react';

type PageProps = {
  params: { zip: string };
  searchParams: { street?: string };
};

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  // get parameters
  const { zip } = await params;
  const { street } = await searchParams;
  const address = street ? `${street}, ${zip}` : zip;

  // coordinates for address
  const { northeast, southwest } = await getCoordinates(address);
  const { state, districts } = await getDistricts({
    northeast,
    southwest,
  });

  return (
    <div className="p-4 flex flex-col items-center ">
      <div className="flex flex-col mb-4 min-w-7xl">
        <h1 className="text-5xl font-bold text-gray-700 text-center m-4">
          Representatives for {zip}
        </h1>
        <h3 className="text-xl font-bold text-gray-700 mb-4 ">
          Federal representatives:
        </h3>
        <Suspense fallback={<p>Loading senators...</p>}>
          <SenateContainer state={state} />
        </Suspense>
        <Suspense fallback={<p>Loading house representatives...</p>}>
          <HouseContainer districts={districts} state={state} />
        </Suspense>
      </div>
    </div>
  );
}
