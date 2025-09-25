import { Skeleton } from '@/components/ui/skeleton';

export default function CardSkeleton() {
  return (
    <div className="flex items-center space-x-4 min-h-[175px]">
      <Skeleton className="h-[100px] w-[100px] rounded-full" />
      <div className="flex-1 items-center space-y-4 py-1 max-w-6xl">
        <Skeleton className="h-4 w-full " />
        <Skeleton className="h-4 w-full " />
      </div>
    </div>
  );
}
