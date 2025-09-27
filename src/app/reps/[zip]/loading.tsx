import CardSkeleton from '@/app/components/cardSkeleton';
import TitleSkeleton from '@/app/components/titleSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <section className="mb-12">
        <TitleSkeleton />
        <div className="flex flex-row items-center space-x-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>

      <section>
        <TitleSkeleton />
        <Skeleton className="w-full h-32 mt-8" />
        <div className="flex flex-row items-center space-x-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </div>
  );
}
