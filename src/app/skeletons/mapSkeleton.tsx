import clsx from "clsx";
import pageStyles from "@/app/reps/[zip]/repsPageClient.module.scss";
import skeletonStyles from "./mapSkeleton.module.scss";

export default function MapSkeleton() {
  return (
    <div
      className={clsx(
        "pt-1 pb-4 sm:pt-2 sm:pb-6 w-full relative flex flex-col items-center justify-start",
        pageStyles.main,
      )}
    >
      <section className={pageStyles.headerSection}>
        <div className={pageStyles.mapContainer}>
          <div className={skeletonStyles.fill}>
            <div className={skeletonStyles.inner}>
              <div className={skeletonStyles.spinner} aria-hidden />
              <p className={skeletonStyles.label}>Fetching results…</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
