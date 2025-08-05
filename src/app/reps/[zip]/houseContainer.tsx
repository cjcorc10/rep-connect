import RepCard from '@/app/reps/[zip]/repCard';
import StreetForm from '@/app/components/streetForm';
import { getHouseReps } from '@/app/lib/db';
import { use } from 'react';
import { Rep } from '@/app/lib/definitions';

// fix any type
type ContainerProps = {
  state: string;
  districts: string[];
};

export default function HouseContainer({
  state,
  districts,
}: ContainerProps) {
  const repsByDistrict = use(getHouseReps(districts, state)) as Rep[];

  return (
    <section>
      <h3>House Representative</h3>
      {districts.length > 1 && (
        <>
          <div className="flex flex-col items-center justify-center my-8">
            <h3 className="text-lg font-bold text-red-500">
              Unable to determine district based on address provided.
              Please provide your street name to narrow down results
            </h3>
            <StreetForm />
          </div>
        </>
      )}
      <div className="flex gap-8 justify-center items-center flex-wrap">
        {repsByDistrict.map((rep) => (
          <div key={rep.bioguide}>
            <RepCard rep={rep} />
          </div>
        ))}
      </div>
    </section>
  );
}
