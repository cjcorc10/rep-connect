import { Suspense } from "react";
import { AsyncPage } from "./asyncPage";

type PageProps = {
  params: Promise<{ zip: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <AsyncPage params={params} />
    </Suspense>
  );
}
