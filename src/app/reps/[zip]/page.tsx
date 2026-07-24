import { RepsPageShell } from "./repsPageShell";
import { AsyncPage } from "./asyncPage";
type PageProps = {
  params: Promise<{ zip: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <>
      <RepsPageShell>
        <AsyncPage params={params} />
      </RepsPageShell>
    </>
  );
}
