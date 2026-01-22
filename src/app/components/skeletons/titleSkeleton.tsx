import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function TitleSkeleton({ showSubtext = false }: { showSubtext?: boolean }) {
  return (
    <header className="mb-4 sm:mb-6 z-30">
      {/* Matches text-[2rem] font-bold - approximately 32px height */}
      <Skeleton className="h-8 w-[250px] rounded-full mb-2" />
      {showSubtext && (
        <Skeleton className="h-5 w-[400px] rounded-full mt-2" />
      )}
    </header>
  );
}
