import Image from 'next/image';
import { Rep } from '../../lib/definitions';
import clsx from 'clsx';
import ContactTag from '../../components/contactTag';
import { Phone } from 'lucide-react';
import Link from 'next/link';

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  return (
    <Link href={`/rep/${rep.bioguide}`} className="no-underline">
      <div className="rounded-lg flex flex-col h-[325px] shadow-lg basis-[300px] max-w-[500px] bg-white hover:scale-105 transition active:scale-[1.02]">
        <div className="flex justify-center items-center min-w-[180px] overflow-hidden rounded-t-lg">
          <Image
            src="/images/joshua-hoehne-X4YSBIsSl9s-unsplash.jpg"
            className="w-full h-[120px] object-fill relative blur rounded-lg"
            width={180}
            height={250}
            alt="american flag background"
          />
          <Image
            className="w-[145px] h-[145px] border-3 border-accent shadow-md rounded-full object-cover absolute object-top"
            src={rep.image_url || ''}
            width={145}
            height={145}
            alt={rep.name}
          />
        </div>
        <div className="flex flex-col flex-1 py-6 px-8 justify-between">
          <div className=" flex flex-col">
            <h3 className="text-2xl font-bold flex items-center justify-center text-accent">
              {rep.name}
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
            <ContactTag url={rep.contact_form || rep.url || ''} />
          </div>
          <div className="flex gap-x-4 justify-center mt-4">
            <a
              href={`tel:${rep.phone}`}
              className="text-xl font-bold  bg-accent flex-1 rounded-md text-center py-2 text-white p-4 shadow-md hover:bg-blue-700 md:hidden"
            >
              <Phone className="inline mr-2 text-white" />
              Call
            </a>
            <p className="text-2xl hidden md:block font-bold text-accent bg-gray-100 rounded-md px-4 py-2 shadow-md">
              phone: {rep.phone}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
