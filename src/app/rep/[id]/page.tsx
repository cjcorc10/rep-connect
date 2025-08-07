import Button from '@/app/components/button';
import { fetchRep } from '@/app/lib/db';
import Image from 'next/image';

type RepPageProps = {
  params: { id: string };
};
export default async function Page({ params }: RepPageProps) {
  const { id } = await params;
  const rep = await fetchRep(id);

  const wiki = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${rep.wikipedia_id.replace(
      ' ',
      '_'
    )}`
  );
  if (!rep) {
    return <div>Representative not found</div>;
  }
  const data = await wiki.json();
  console.log('data', data);

  console.log('rep', rep);

  return (
    <div className="relative">
      <Image
        src="/images/america.jpg"
        alt="American flag"
        width={1000}
        height={1000}
        className="h-70 object-cover w-full blur-sm"
      />
      <div className="flex relative">
        <Image
          src={data.originalimage.source}
          alt={rep.full_name}
          width={1000}
          height={1000}
          className="w-60 h-60 rounded-[5rem] object-cover object-top mx-8 relative top-[-4rem]"
        />
        <div className="flex-1 pt-8 flex">
          <div>
            <h2 className="font-bold text-3xl">{rep.full_name}</h2>
            {rep.type === 'senator' ? (
              <h3 className="text-xl">Senator for {rep.state}</h3>
            ) : (
              <h3 className="text-xl">Congressman for {rep.state}</h3>
            )}
            {rep.district && (
              <p className="text-lg">District {rep.district}</p>
            )}
            <a
              href={`https://twitter.com/${rep.twitter}`}
              className="text-blue-500 hover:underline"
            >
              send mean tweets to {rep.first_name}
            </a>
          </div>
          <p>
            {Math.floor(
              (new Date().getTime() -
                new Date(rep.birthday).getTime()) /
                3.15576e10
            )}{' '}
            years old
          </p>
          <a href={rep.url} className="text-blue-500 hover:underline">
            {rep.url}
          </a>
          <p>{rep.address}</p>
          <p>{rep.phone}</p>
        </div>
      </div>
      <div>
        <p>
          {data.extract || 'No additional information available.'}
        </p>
        <p></p>
        <a
          // href={`https://www.opensecrets.org/members-of-congress/summary?cid=${rep.opensecrets_id}`}
          className="text-blue-500 hover:underline"
        >
          opensecrets
        </a>
      </div>
    </div>
  );
}
