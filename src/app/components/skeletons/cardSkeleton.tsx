import { Skeleton } from '@/components/ui/skeleton';

export default function CardSkeleton() {
  return (
    <div className="flex items-center space-x-4 min-h-[175px] w-full">
      <Skeleton className="h-[100px] w-[100px] rounded-full" />
      <div className="flex flex-col flex-1 space-y-4">
        <Skeleton className="h-6 w-[175px] rounded-full" />
        <Skeleton className="h-6 w-[400px] rounded-full" />
        <Skeleton className="h-6 w-[150px] rounded-full" />
      </div>
    </div>
  );
}
