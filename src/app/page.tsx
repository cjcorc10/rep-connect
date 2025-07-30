import SearchForm from './components/searchForm';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <h1 className="text-6xl mb-8 text-center text-black font-bold">
        Make your voice heard,
        <br /> contact your representatives{' '}
        <span className="font-bold text-accent">Today.</span>
      </h1>
      <SearchForm />
    </div>
  );
}
