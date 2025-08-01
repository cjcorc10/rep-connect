import RepCard from '@/app/components/repCard';
import { getRepImage, getSenators } from '@/app/lib/util';
import { use } from 'react';

type SenateContainerProps = {
  state: string;
};

export default function SenateContainer({
  state,
}: SenateContainerProps) {
  const senators = use(getSenators(state));
  senators.forEach(
    (senator) => (senator.image = use(getRepImage(senator.id)))
  );

  return (
    <section>
      <div className="flex flex-col gap-y-4">
        {senators.map((senator) => (
          <div key={senator.id} className="mb-4">
            <RepCard rep={senator} />
          </div>
        ))}
      </div>
    </section>
  );
}
