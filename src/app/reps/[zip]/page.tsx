import Address from '@/app/components/address';
import RepFetchWrapper from '@/app/components/repFetchWrapper';
import { Suspense } from 'react';
import Loading from './loading';

type PageProps = {
  params: Promise<{ zip: string }>;
  searchParams: Promise<{ street?: string }>;
};

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const { zip } = await params;
  const { street } = await searchParams;
  const address = street ? `${street}, ${zip}` : zip;

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <section className="max-w-6xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <Suspense fallback={<p>Loading...</p>}>
            <Address address={address} />
          </Suspense>
          <h2 className="text-2xl font-bold mt-4">
            Your Representatives
          </h2>
          <p className="text-lg text-gray-700">
            Find and contact your elected officials in Congress. Your
            voice matters in our democracy.
          </p>
        </header>
        <Suspense fallback={<Loading />}>
          <RepFetchWrapper address={address} />
        </Suspense>
      </section>
    </main>
  );
}
