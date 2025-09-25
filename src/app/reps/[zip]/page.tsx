import { Suspense } from 'react';
import { getCoordinates, getDistricts } from '@/app/lib/util';
import HouseContainer from './houseContainer';
import SenateContainer from './senateContainer';
import Address from '@/app/components/address';
import Loading from './loading';

type PageProps = {
  params: { zip: string };
  searchParams: { street?: string };
};

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const { zip } = await params;
  const { street } = await searchParams;
  const address = street ? `${street}, ${zip}` : zip;

  const { northeast, southwest } = await getCoordinates(address);
  const { state, districts } = await getDistricts({
    northeast,
    southwest,
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <section className="max-w-6xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <Address address={address} />
          <h2 className="text-2xl font-bold mt-4">
            Your Representatives
          </h2>
          <p className="text-lg text-gray-700">
            Find and contact your elected officials in Congress. Your
            voice matters in our democracy.
          </p>
        </header>
        <Suspense fallback={<Loading />}>
          <SenateContainer state={state} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <HouseContainer districts={districts} state={state} />
        </Suspense>
      </section>
    </main>
  );
}
