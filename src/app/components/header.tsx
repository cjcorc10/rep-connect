import Nav from "./nav";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 pt-4 pb-2 bg-black text-white">
      <h1 className="text-2xl font-bold">rep connect</h1>
      <Nav />
    </header>
  );
}
