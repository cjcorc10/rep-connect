'use client';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import React from 'react';

gsap.registerPlugin(useGSAP);

export default function JumpingImage() {
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.from(imageRef.current, {
      delay: 1.5,
      duration: 1,
      xPercent: 100,
      ease: 'back(.8)',
    });
  });
  return (
    <Image
      src="/images/chloe.svg"
      alt="chloe logo"
      ref={imageRef}
      width={100}
      height={100}
      className="w-100 h-200 rotate-[-40deg] z-10 hidden xl:block"
    ></Image>
  );
}
