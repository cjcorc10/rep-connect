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
      <div className={clsx('flex flex-col gap-y-4')}>
        {repsByDistrict.map((rep) => (
          <div key={rep.id} className="mb-4">
            <RepCard rep={rep} />
          </div>
        ))}
      </div>
      {districts.length > 1 && (
        <>
          <div className="flex flex-col items-center justify-center mt-4">
            <h3>
              Unable to determine district based on address provided,
              your representative is one of the following:
            </h3>
            <h3 className="text-lg mb-2">
              Please provide your street name to narrow down results
            </h3>
            <StreetForm />
          </div>
        </>
      )}
    </section>
  );
}
