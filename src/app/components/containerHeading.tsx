export default function ContainerHeading({
  children,
  isSenate,
}: {
  children: React.ReactNode;
  isSenate: boolean;
}) {
  return (
    <header className="mb-4 sm:mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
        U.S. {isSenate ? 'Senate' : 'House of Representatives'}
      </h2>
      {children}
    </header>
  );
}
