import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function TitleSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-[200px] rounded-full mb-4" />
      <Skeleton className="h-6 w-[300px] rounded-full" />
    </div>
  );
}
