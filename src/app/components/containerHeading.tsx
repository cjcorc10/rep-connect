export default function ContainerHeading({
  children,
  isSenate,
}: {
  children?: React.ReactNode;
  isSenate: boolean;
}) {
  return (
    <header className="mb-4 sm:mb-6 z-30">
      <h2 className="text-[2rem] font-bold text-gray-800">
        U.S. {isSenate ? "Senate" : "House of Representatives"}
      </h2>
      {children}
    </header>
  );
}
