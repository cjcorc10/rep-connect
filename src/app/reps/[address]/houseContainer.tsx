import RepCard from '@/app/components/repCard';
import { Rep } from '@/app/lib/definitions';

// fix any type
type ContainerProps = {
  repsByDistrict: Rep[];
};

export default function HouseContainer({
  repsByDistrict,
}: ContainerProps) {
  return (
    <div>
      {repsByDistrict.map((rep) => (
        <div key={rep.id} className="mb-4">
          <h3 className="text-xl font-semibold">
            District: {rep.district}
          </h3>
          <RepCard rep={rep} />
        </div>
      ))}
    </div>
  );
}
