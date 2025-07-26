import { Rep } from '../lib/definitions';
import clsx from 'clsx';

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  return (
    <div>
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
