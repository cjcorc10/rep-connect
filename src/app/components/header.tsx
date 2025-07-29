import Nav from "./nav";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 bg-black text-white h-12">
      <h1 className="text-2xl font-bold">rep connect</h1>
      <Nav />
    </header>
  );
}
