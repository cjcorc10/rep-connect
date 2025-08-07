import Image from 'next/image';
import SearchForm from './components/searchForm';

export default function Home() {
  return (
    <div
      className="flex flex-col flex-1 items-center pt-30"
      style={{
        backgroundImage:
          'radial-gradient(circle, gray 1px, transparent 0)',
        backgroundSize: '20px 20px',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="max-w-[1000px] h-[450px] relative rounded-[3rem] overflow-hidden flex flex-col items-center justify-center shadow-2xl">
        <Image
          src="/images/kamran-abdullayev.jpg"
          alt="voting background"
          width={1000}
          height={1000}
          className="max-w-full h-full rounded-[3rem] object-cover z-0 absolute top-0 left-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />
        <h1 className="text-6xl mb-8 text-center text-white font-bold p-8 z-10 relative">
          Make your voice heard,
          <br /> contact your representatives{' '}
          <span className="font-bold text-accent">Today.</span>
        </h1>
        <SearchForm />
      </div>
    </div>
  );
}
