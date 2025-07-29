import RepCard from "@/app/components/repCard";
import { getRep } from "@/app/lib/actions";
import { Rep } from "@/app/lib/definitions";

// fix any type
type ContainerProps = {
  state: string;
  districts: string[];
};

export default async function HouseContainer({
  state,
  districts,
}: ContainerProps) {
  // fetch house reps by district
  const repsByDistrict = await Promise.all(
    districts.map(async (district: string) => {
      const rep = await getRep(district, state);
      return rep;
    })
  );

  return (
    <div className="flex justify-center flex-wrap">
      <h2>House of Representatives:</h2>

      {repsByDistrict.map((rep) => (
        <div key={rep.id} className="mb-4">
          <h3 className="text-xl font-semibold">District: {rep.district}</h3>
          <RepCard rep={rep} />
        </div>
      ))}
    </div>
  );
}
