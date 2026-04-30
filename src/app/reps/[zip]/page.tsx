import { Suspense, ViewTransition } from "react";
import HeaderWrapper from "@/app/components/headerWrapper";
import HeaderSkeleton from "../../skeletons/headerSkeleton";
import RepsPageWrapper from "@/app/components/repsPageWrapper";
import MapSkeleton from "@/app/skeletons/mapSkeleton";

type Props = {
  params: Promise<{ zip: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page({ params }: Props) {
  return (
    <ViewTransition>
      <main>
        <Suspense fallback={<HeaderSkeleton />}>
          <HeaderWrapper params={params} />
        </Suspense>
        <Suspense fallback={<MapSkeleton />}>
          <RepsPageWrapper params={params} />
        </Suspense>
      </main>
    </ViewTransition>
  );
}
