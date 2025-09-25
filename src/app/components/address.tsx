'use client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

type AddressProps = {
  address: string;
};

export default function Address({ address }: AddressProps) {
  const addressRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(addressRef.current, {
        scale: 0,
        ease: 'back',
        duration: 1,
      });
    },
    { dependencies: [address] }
  );

  return (
    <div className="flex justify-center items-center">
      <div
        className="flex justify-center items-center w-24 h-24 bg-blue-200 opacity-80 rounded-full z-0"
        ref={addressRef}
      >
        <h1 className="text-3xl text-blue-700 z-10 font-bold whitespace-nowrap">
          {address}
        </h1>
      </div>
    </div>
  );
}
