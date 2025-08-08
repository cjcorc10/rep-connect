import { Suspense } from 'react';
import { getCoordinates, getDistricts } from '@/app/lib/util';
import HouseContainer from './houseContainer';
import SenateContainer from './senateContainer';
import FadeIn from './fadein';

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

  // coordinates for address -> then districts
  const { northeast, southwest } = await getCoordinates(address);
  const { state, districts } = await getDistricts({
    northeast,
    southwest,
  });

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <section className="max-w-6xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
            Representatives for {address}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Federal representatives
          </p>
        </header>

        <FadeIn>
          <Suspense
            fallback={
              <p className="text-gray-500 mb-6">Loading senators…</p>
            }
          >
            <SenateContainer state={state} />
          </Suspense>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Suspense
            fallback={
              <p className="text-gray-500 mt-6">
                Loading House representatives…
              </p>
            }
          >
            <HouseContainer districts={districts} state={state} />
          </Suspense>
        </FadeIn>
      </section>
    </main>
  );
}
