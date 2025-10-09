export default function SenateContainer({
  children,
  state,
}: {
  children: React.ReactNode;
  state: string;
}) {
  return (
    <section
      aria-labelledby="senate-heading"
      className="mt-6 sm:mt-8"
    >
      <header className="mb-4 sm:mb-6">
        <h2
          id="senate-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800"
        >
          U.S. Senate
        </h2>
        <p className="mt-1 text-md text-gray-600">
          Senators representing the state of {state}
        </p>
      </header>

      <div
        className="
          grid gap-4 sm:gap-6
          grid-cols-1
          sm:grid-cols-2
        "
      >
        {children}
      </div>
    </section>
  );
}
