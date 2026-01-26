import ContainerHeading from "./containerHeading";

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
      <ContainerHeading isSenate={true} />
      <div className="flex gap-16 justify-center flex-wrap">
        {children}
      </div>
    </section>
  );
}
