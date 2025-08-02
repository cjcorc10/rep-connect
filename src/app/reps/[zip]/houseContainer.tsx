import RepCard from '@/app/components/repCard';
import clsx from 'clsx';
import StreetForm from '@/app/components/streetForm';
import {
  getRep,
  getRepImage,
  getRepsByDistrictAndState,
} from '@/app/lib/util';
import { use } from 'react';

// fix any type
type ContainerProps = {
  state: string;
  districts: string[];
};

export default function HouseContainer({
  state,
  districts,
}: ContainerProps) {
  // fetch house reps by district
  const repsByDistrict = use(
    getRepsByDistrictAndState(districts, state)
  );
  repsByDistrict.forEach(
    (rep) => (rep.image = use(getRepImage(rep.id)))
  );

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
          <div key={rep.id}>
            <RepCard rep={rep} />
          </div>
        ))}
      </div>
    </section>
  );
}
