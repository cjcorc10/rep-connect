'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/all';
import gsap from 'gsap';
import Image from 'next/image';
import SearchForm from './searchForm';

gsap.registerPlugin(SplitText, useGSAP);

export default function Hero() {
  // Refs for GSAP animations
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  //
  useGSAP(() => {
    const split = new SplitText(spanRef.current, { type: 'chars' });

    gsap.set(spanRef.current, { perspective: 400 });
    gsap
      .timeline()
      .from(heroRef.current, {
        opacity: 0,
        duration: 0.3,
      })
      .from(
        titleRef.current,
        {
          delay: 0.5,
          opacity: 0,
          y: 10,
          ease: 'back',
        },
        '-=0.5'
      )
      .from(
        formRef.current,
        { y: 30, opacity: 0, ease: 'back' },
        '-=0.3'
      )
      .from(split.chars, {
        opacity: 0,
        scale: 0,
        rotationX: 180,
        transformOrigin: '0% 50% -50',
        ease: 'back',
        duration: 0.8,
        stagger: 0.05,
      });
  });

  return (
    <section
      className="
            relative w-full overflow-hidden shadow-2xl
            sm:rounded-3xl sm:max-w-[min(1000px,92vw)]
            sm:h-[clamp(22rem,48vh,34rem)]
          "
      ref={heroRef}
    >
      <div className="hidden sm:block absolute inset-0">
        <Image
          src="/images/kamran-abdullayev.jpg"
          alt="voting image"
          aria-hidden="true"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 92vw, 1000px"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8">
        <header className="text-center">
          <h1
            className="text-3xl sm:text-5xl font-bold leading-tight text-gray-50"
            ref={titleRef}
          >
            Make your voice heard,
            <br />
            contact your representatives{' '}
            <span
              id="hero-last"
              className="font-extrabold text-pink-300"
              ref={spanRef}
            >
              Today.
            </span>
          </h1>
        </header>

        <div
          className="mt-4 w-full max-w-[720px]"
          aria-label="Find your representatives by location"
        >
          <div ref={formRef}>
            <SearchForm />
          </div>
        </div>
      </div>
    </section>
  );
}
