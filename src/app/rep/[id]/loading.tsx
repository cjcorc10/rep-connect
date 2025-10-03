// app/reps/[id]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="relative" aria-busy="true" aria-live="polite">
      <header className="relative">
        {/* Hero image skeleton */}
        <div className="relative w-full aspect-[16/9] sm:h-56 md:h-74">
          <Skeleton className="absolute inset-0" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative -mt-12 sm:-mt-14 md:flex">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end w-full">
              {/* Portrait skeleton */}
              <figure className="shrink-0">
                <Skeleton className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-3xl border border-white/40 shadow-lg" />
              </figure>

              {/* Name / role / actions skeleton */}
              <div className="text-center sm:text-left flex flex-col gap-2">
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />{' '}
                {/* Name */}
                <Skeleton className="h-4 sm:h-5 w-32 sm:w-48" />{' '}
                {/* Role */}
                <div className="flex gap-3 mt-2 justify-center sm:justify-start">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-28 rounded" />
                  <Skeleton className="h-8 w-32 rounded" />
                </div>
              </div>
            </div>

            {/* Term expiration skeleton */}
            <aside className="flex-1 flex flex-col items-center justify-center text-center sm:text-left mt-6 sm:mt-0">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-5 w-32" />
            </aside>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Overview */}
        <section>
          <Skeleton className="h-6 w-40 mb-3" />
          <Skeleton className="h-20 w-full" />
        </section>

        {/* Details */}
        <section>
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </section>

        {/* Contact */}
        <aside className="border-t pt-5 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-40 rounded" />
        </aside>

        {/* Transparency */}
        <section className="border-t pt-5 space-y-2">
          <Skeleton className="h-6 w-56 mb-3" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-80" />
        </section>
      </article>
    </main>
  );
}
