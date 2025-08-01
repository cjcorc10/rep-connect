import Image from 'next/image';
import { Rep } from '../lib/definitions';
import clsx from 'clsx';

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  return (
    <div className="p-4 rounded-lg flex">
      <Image
        className="rounded-md mb-2 w-[100px] h-[150px] object-cover border border-black/10  "
        src={rep.image || ''}
        width={100}
        height={150}
        alt={rep.name}
      />
      <div className="ml-4">
        <h3 className="text-xl font-bold">{rep.name}</h3>
        <p
          className={clsx('text-sm font-bold', {
            'text-blue-500': rep.party === 'Democratic',
            'text-red-500': rep.party === 'Republican',
            'text-green-500': rep.party === 'Independent',
            'text-gray-500': !rep.party,
          })}
        >
          {'(' + rep.party[0] + ' - ' + rep.state + ')'}
        </p>
        {rep.district && <p>District: {rep.district}</p>}
        <p>Address: {rep.address}</p>
        <p>Phone: {rep.phone}</p>
        {rep.additionalContactInfo && (
          <p>
            Contact Form:{' '}
            <a
              className="text-blue-500"
              href={rep.additionalContactInfo}
            >
              {rep.additionalContactInfo}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
