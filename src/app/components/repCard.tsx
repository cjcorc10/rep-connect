import Image from 'next/image';
import { Rep } from '../lib/definitions';
import clsx from 'clsx';

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  return (
    <div className="rounded-lg flex w-[525px] h-[200px] bg-white border-gray-300 shadow-md p-4">
      <div className='flex justify-center w-[150px] items-center'>

      <Image
        className="w-[100px] h-[100px] object-cover border border-gray-200 rounded-full object-cover object-top"
        src={rep.image || ''}
        width={100}
        height={100}
        alt={rep.name}
        />
        </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-2">{rep.name} 
        <span
          className={clsx('ml-2 text-sm font-bold', {
            'text-blue-500': rep.party === 'Democratic',
            'text-red-500': rep.party === 'Republican',
            'text-green-500': rep.party === 'Independent',
            'text-gray-500': !rep.party,
          })}
        >
          {'(' + rep.party[0] + ' - ' + rep.state + ')'}
        </span>
        </h3>
        {rep.district && <p>District: {rep.district}</p>}
        <p>Address: {rep.address}</p>
        <p>Phone: {rep.phone}</p>
        {rep.additionalContactInfo ? (
          <p>
            Contact Form:{' '}
            <a
              className="text-blue-500 underline"
              href={rep.additionalContactInfo}
            >
              {rep.additionalContactInfo}
            </a>
          </p>
        ) : (
          <p>URL: <a className='text-blue-500 underline' href={rep.url}>{rep.url}</a></p>
        )}
      </div>
    </div>
  );
}
