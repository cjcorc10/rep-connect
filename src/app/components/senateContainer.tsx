import ContainerHeading from "./containerHeading";

export default function SenateContainer({
  children,
}: {
  children: React.ReactNode;
  state: string;
}) {
  return (
    <section aria-labelledby="senate-heading">
      <ContainerHeading isSenate={true} />
      {children}
    </section>
  );
}
