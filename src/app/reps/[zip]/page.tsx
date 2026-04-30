import { Suspense, ViewTransition } from "react";
import HeaderWrapper from "@/app/components/headerWrapper";
import HeaderSkeleton from "../../skeletons/headerSkeleton";
import RepsPageWrapper from "@/app/components/repsPageWrapper";
import MapSkeleton from "@/app/skeletons/mapSkeleton";

type PageProps = {
  params: Promise<{zip: string}>
};

export default async function Page({ params }: PageProps) {
  return (
      <main>
        <Suspense fallback={<HeaderSkeleton />}>
          <HeaderWrapper params={params} />
        </Suspense>
        <Suspense fallback={<MapSkeleton />}>
          <RepsPageWrapper params={params} />
        </Suspense>
      </main>
  );
}
