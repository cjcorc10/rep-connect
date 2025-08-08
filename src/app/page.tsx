'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import SearchForm from './components/searchForm';

export default function Home() {
  return (
    <main
      className="flex flex-col flex-1 min-h-0"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,.08) 1px, transparent 0)',
        backgroundSize: '20px 20px',
        backgroundRepeat: 'repeat',
      }}
    >
      <section
        aria-labelledby="hero-title"
        className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 py-4 flex-1"
      >
        {/* Mobile background image */}
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

        {/* Card container (only on sm+) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="
            relative w-full overflow-hidden shadow-2xl
            sm:rounded-3xl sm:max-w-[min(1000px,92vw)]
            sm:h-[clamp(22rem,48vh,34rem)]
          "
        >
          {/* Desktop background image */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src="/images/kamran-abdullayev.jpg"
              alt=""
              aria-hidden="true"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 92vw, 1000px"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8">
            <motion.header
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="text-center"
            >
              <h1
                id="hero-title"
                className="
                  font-bold text-white leading-tight
                  text-[clamp(1.45rem,3.2vw+0.9rem,2.6rem)]
                "
              >
                Make your voice heard,
                <br />
                contact your representatives{' '}
                <span className="font-extrabold text-blue-500">
                  Today.
                </span>
              </h1>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.12 }}
              className="mt-4 w-full max-w-[720px]"
              aria-label="Find your representatives by location"
            >
              <SearchForm />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
