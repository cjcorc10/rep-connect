import RepCard from '@/app/reps/[zip]/repCard';
import { getSenators } from '@/app/lib/db';
import { use } from 'react';

type SenateContainerProps = {
  state: string;
};

export default function SenateContainer({
  state,
}: SenateContainerProps) {
  const senators = use(getSenators(state));

  return (
    <section>
      <h2>{state} Senators</h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {senators.map((senator) => (
          <div key={senator.bioguide} className="mb-4">
            <RepCard rep={senator} />
          </div>
        ))}
      </div>
    </section>
  );
}
