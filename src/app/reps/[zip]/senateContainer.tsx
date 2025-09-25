import { use } from 'react';
import RepCard from '@/app/reps/[zip]/repCard';
import { getSenators } from '@/app/lib/db';
import type { Rep } from '@/app/lib/definitions';

type SenateContainerProps = {
  state: string;
};

export default function SenateContainer({
  state,
}: SenateContainerProps) {
  const senators = use(getSenators(state)) as Rep[];

  return (
    <section
      aria-labelledby="senate-heading"
      className="mt-6 sm:mt-8"
    >
      <header className="mb-4 sm:mb-6">
        <h2
          id="senate-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800"
        >
          U.S. Senate
        </h2>
        <p className="mt-1 text-md text-gray-600">
          Senators representing the state of {state}
        </p>
      </header>

      <div
        className="
          grid gap-4 sm:gap-6
          grid-cols-1
          sm:grid-cols-2
        "
      >
        {senators.map((senator) => (
          <RepCard key={senator.bioguide_id} rep={senator} />
        ))}
      </div>

      {senators.length === 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 p-6 text-center text-gray-600">
          No senators found for this state.
        </div>
      )}
    </section>
  );
}
