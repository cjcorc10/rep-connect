import Image from 'next/image';
import JumpingImage from './components/jumpinImage';
import Hero from './components/hero';

export default function Home() {
  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
      <div className="absolute right-[-6%]">
        <JumpingImage />
      </div>
      <section
        aria-labelledby="hero-title"
        className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 py-4 flex-1"
      >
        <div className="absolute inset-0 sm:hidden">
          <Image
            src="/images/kamran-abdullayev.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Hero />
      </section>
    </main>
  );
}
