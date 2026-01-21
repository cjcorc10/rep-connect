import CardSkeleton from '@/app/components/skeletons/cardSkeleton';
import TitleSkeleton from '@/app/components/skeletons/titleSkeleton';

export default function RepsSkeleton() {
  return (
    <div>
      <section
        aria-labelledby="senate-heading"
        className="mt-6 sm:mt-8"
      >
        <TitleSkeleton />
        <div className="flex gap-12 justify-center flex-wrap">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>

      <section
        aria-labelledby="house-heading"
        className="mt-6"
      >
        <TitleSkeleton />
        <div className="flex flex-wrap gap-12 justify-center">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </div>
  );
}
