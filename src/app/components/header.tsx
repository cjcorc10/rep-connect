import Nav from './nav';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 bg-white h-12 mt-1">
      <h1 className="text-2xl font-bold ">Repconnect</h1>
      <Nav />
    </header>
  );
}
