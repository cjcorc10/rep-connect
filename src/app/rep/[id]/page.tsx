import { fetchRep } from '@/app/lib/db';
import Image from 'next/image';

type RepPageProps = {
  params: { id: string };
};
export default async function Page({ params }: RepPageProps) {
  const { id } = await params;
  const rep = await fetchRep(id);

  console.log('rep', rep);

  return (
    <div className="flex p-8">
      <div className="">
        <Image
          src={rep.image_url}
          alt={rep.name}
          width={500}
          height={500}
          className="rounded-4xl w-70 h-100 shadow-lg"
        />
        <h2>{rep.name}</h2>
        <p>
          Age:{' '}
          {Math.floor(
            (new Date().getTime() -
              new Date(rep.birthday).getTime()) /
              3.15576e10
          )}{' '}
          years old
        </p>
        <p>District: {rep.district}</p>
        <p>Next Election: {rep.end}</p>
        <p>URL: {rep.url}</p>
        <p>Phone: {rep.phone}</p>
        <p>Office: {rep.address}</p>
      </div>

      <p>
        Voting history, bills proposed, committee memberships, and
        more...
      </p>
    </div>
  );
}
