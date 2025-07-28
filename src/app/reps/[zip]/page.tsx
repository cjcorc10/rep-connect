import SearchForm from '@/app/components/searchForm';
import {
  getCoordinates,
  getDistricts,
  getRep,
} from '@/app/lib/actions';
import HouseContainer from './houseContainer';

type PageProps = {
  params: { zip: string };
  searchParams: { address?: string };
};

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  // user input address
  const { zip } = await params;
  const { address } = await searchParams;
  console.log('address:', address);
  // coordinates for address
  const { northeast, southwest } = await getCoordinates(zip);
  // district(s) in address
  const { state, districts } = await getDistricts({
    northeast,
    southwest,
  });

  // representatives for each district
  const repsByDistrict = await Promise.all(
    districts.map(async (district: string) => {
      const rep = await getRep(district, state);
      return rep;
    })
  );
  console.log('Reps by district:', repsByDistrict);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">
        Representatives for {zip}
      </h1>
      {/* Displaying representatives for the district(s) 
        - senators
        - house members
        */}
      <h2>Senate:</h2>
      {/* <SenateContainer senators={senators} /> */}

      <h2>House of Representatives:</h2>
      <h3>
        Unable to determine district based on address provided, your
        representative is one of the following:
      </h3>
      <HouseContainer repsByDistrict={repsByDistrict} />
      {districts.length > 1 && (
        <>
          <div className="flex flex-col items-center justify-center mt-4">
            <h3 className="text-lg mb-2">
              Please provide your street name to narrow down results
            </h3>
            {/* <SearchForm type={'street'} /> */}
          </div>
        </>
      )}
    </div>
  );
}
