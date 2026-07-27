import { Suspense } from "react";
import { RepsPageShell } from "./repsPageShell";
import { AsyncPage } from "./asyncPage";

type PageProps = {
  params: Promise<{ zip: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <RepsPageShell>
        <AsyncPage params={params} />
      </RepsPageShell>
    </Suspense>
  );
}
