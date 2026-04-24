import pageStyles from "@/app/reps/[zip]/repsPageClient.module.scss";

function MapSkeleton() {
  return (
    <div className={pageStyles.mapContainer}>
      <div className="repsMapSkeletonInner">
        <div className="repsMapSpinner" aria-hidden />
        <p className="repsMapSkeletonLabel">Fetching results…</p>
      </div>
    </div>
  );
}

export default MapSkeleton;
