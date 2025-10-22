import ContainerHeading from './containerHeading';

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
      <ContainerHeading isSenate={true}>
        <p className="mt-1 text-md text-gray-600">
          Senators representing the state of {state}
        </p>
      </ContainerHeading>
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
