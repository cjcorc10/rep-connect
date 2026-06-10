import pageStyles from "@/app/reps/[zip]/repsPageClient.module.scss";
import skeletonStyles from "./mapSkeleton.module.scss";

export default function MapSkeleton() {
  return (
    <section className={pageStyles.mapSection}>
      <div className={pageStyles.mapContainer}>
        <div className={skeletonStyles.fill}>
          <div className={skeletonStyles.inner}>
            <div className={skeletonStyles.spinner} aria-hidden />
            <p className={skeletonStyles.label}>Fetching results…</p>
          </div>
        </div>
      </div>
    </section>
  );
}
