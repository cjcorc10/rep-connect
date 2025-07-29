import Image from 'next/image';
import { Rep } from '../lib/definitions';
import clsx from 'clsx';

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  return (
    <div className="border p-8 rounded-lg shadow-md flex flex-col hover:scale-105 transition-transform duration-300 bg-white">
      <Image
        className="rounded-lg mb-2 w-[200px] h-[300px] object-cover "
        src={rep.image || ''}
        width={200}
        height={200}
        alt={rep.name}
      />
      <h3>{rep.name}</h3>
      <p
        className={clsx('text-sm font-bold', {
          'text-blue-500': rep.party === 'Democratic',
          'text-red-500': rep.party === 'Republican',
          'text-green-500': rep.party === 'Independent',
          'text-gray-500': !rep.party,
        })}
      >
        {rep.party}
      </p>
    </div>
  );
}
