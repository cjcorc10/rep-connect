import { Skeleton } from '@/components/ui/skeleton';

export default function CardSkeleton() {
  return (
    <div className="relative h-[65vh] w-full max-w-[32rem] rounded-[3rem] overflow-hidden shadow-lg">
      {/* Image skeleton with gradient overlay */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-[3rem]" />
      {/* Gradient overlay simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50 rounded-[3rem]" />
      {/* Name skeleton at bottom center - matches display-d2 typography */}
      <Skeleton className="absolute bottom-5 left-1/2 -translate-x-1/2 h-8 w-48 rounded-full" />
    </div>
  );
}
