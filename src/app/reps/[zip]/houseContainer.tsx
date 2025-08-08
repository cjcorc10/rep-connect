import { use } from 'react';
import RepCard from '@/app/reps/[zip]/repCard';
import StreetForm from '@/app/components/streetForm';
import { getHouseReps } from '@/app/lib/db';
import type { Rep } from '@/app/lib/definitions';

type ContainerProps = {
  state: string;
  districts: string[];
};

export default function HouseContainer({
  state,
  districts,
}: ContainerProps) {
  const repsByDistrict = use(getHouseReps(districts, state)) as Rep[];
  const multipleDistricts = districts.length > 1;

  return (
    <section aria-labelledby="house-heading" className="mt-6 sm:mt-8">
      <header className="mb-4 sm:mb-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2
            id="house-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            U.S. House of Representatives
          </h2>
          <p className="text-sm text-amber-600 font-bold">
            {repsByDistrict.length}{' '}
            {repsByDistrict.length === 1 ? 'result' : 'results'}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Showing representatives for your location in {state}.
        </p>
      </header>

      {multipleDistricts && (
        <div className="mb-24 rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col items-center ">
          <p className="text-sm sm:text-base font-medium text-amber-900">
            We couldn’t determine a single district from your ZIP. Add
            your street to narrow it down:
          </p>
          <div className="max-w-xl">
            <StreetForm />
          </div>
        </div>
      )}

      <div
        className="
          grid gap-4 sm:gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {repsByDistrict.map((rep) => (
          <RepCard key={rep.bioguide_id} rep={rep} />
        ))}
      </div>

      {repsByDistrict.length === 0 && !multipleDistricts && (
        <div className="mt-6 rounded-lg border border-gray-200 p-6 text-center text-gray-600">
          No House representatives found for this address.
        </div>
      )}
    </section>
  );
}
