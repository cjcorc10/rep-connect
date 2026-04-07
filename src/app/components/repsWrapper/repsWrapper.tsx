"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import clsx from "clsx";
import RepDetailDrawer from "../repDetailDrawer/repDetailDrawer";
import { resolveRepPortraitUrl } from "../repCard/useRepImage";
import styles from "./repsWrapper.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import type { Rep, RepsData } from "@/app/lib/definitions";
import { useRepStore } from "@/app/store/useRepStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Next federal midterm general election calendar year (Nov, years ≡ 2 mod 4). */
function nextMidtermElectionYear(from: Date = new Date()): number {
  let y = from.getFullYear();
  for (;;) {
    while (y % 4 !== 2) y += 1;
    const electionCutoff = new Date(y, 10, 15);
    if (from.getTime() <= electionCutoff.getTime()) return y;
    y += 4;
  }
}

/** Term ends during the congressional turnover for the upcoming midterm (that year or following Jan). */
function termEndsAtNextMidterm(
  termEnd: Date,
  from: Date = new Date(),
): boolean {
  if (termEnd.getTime() <= from.getTime()) return false;
  const m = nextMidtermElectionYear(from);
  const y = termEnd.getFullYear();
  return y === m || y === m + 1;
}

function RepHoverPortrait({ imageUrl }: { imageUrl: string }) {
  return (
    <div className={styles.repRowImageInner}>
      {imageUrl.trim() ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="352px"
          quality={88}
          className={styles.repRowImageImg}
        />
      ) : (
        <div className={styles.repRowImagePlaceholder} aria-hidden />
      )}
    </div>
  );
}

function RepNameNavRow({
  rep,
  interactive,
  onActivate,
  isActiveHoverRow,
  onRowMouseEnter,
  onRowMouseLeave,
  hoverPortraitUrl,
  portraitAlignBottom,
  districtColorByDistrict,
}: {
  rep: Rep;
  interactive: boolean;
  onActivate?: () => void;
  isActiveHoverRow: boolean;
  onRowMouseEnter: () => void;
  onRowMouseLeave: () => void;
  hoverPortraitUrl: string;
  portraitAlignBottom: boolean;
  districtColorByDistrict?: Record<
    string,
    { fill: string; stroke: string }
  >;
}) {
  const chamber = rep.type === "sen" ? "Senate" : "House";
  const district =
    rep.type === "sen" ? rep.state : rep.district;
  const termEndDate = new Date(rep.end);
  const termEnd = termEndDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const termIsNextMidterm = termEndsAtNextMidterm(termEndDate);
  const shortName = `${rep.first_name[0]}.${rep.last_name}`;
  const districtColor =
    rep.type === "sen"
      ? undefined
      : districtColorByDistrict?.[String(rep.district)];

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        interactive
          ? `Open details and scroll to ${rep.full_name}`
          : undefined
      }
      onClick={interactive ? onActivate : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate?.();
              }
            }
          : undefined
      }
      onMouseEnter={onRowMouseEnter}
      onMouseLeave={onRowMouseLeave}
      onFocus={onRowMouseEnter}
      onBlur={onRowMouseLeave}
      className={clsx(
        styles.repNameNav,
        isActiveHoverRow && styles.repNameNavHoverLift,
      )}
    >
      <div className={styles.repNameNavCell}>
        <span className={styles.colValue}>{shortName}</span>
      </div>
      <div className={styles.repNameNavCell} aria-hidden="true">
        {isActiveHoverRow ? (
          <div
            className={clsx(
              styles.repRowImageFloat,
              portraitAlignBottom && styles.repRowImageFloatBottom,
            )}
          >
            <RepHoverPortrait imageUrl={hoverPortraitUrl} />
          </div>
        ) : null}
      </div>
      <div className={styles.repNameNavCell}>
        <span className={styles.colValue}>{chamber}</span>
      </div>
      <div className={styles.repNameNavCell}>
        <span
          className={styles.colValue}
          style={
            districtColor
              ? {
                  color: districtColor.fill,
                }
              : undefined
          }
        >
          {district}
        </span>
      </div>
      <div className={styles.repNameNavCell}>
        <span
          className={clsx(
            styles.colValue,
            termIsNextMidterm && styles.termNextMidterm,
          )}
        >
          {termEnd}
        </span>
      </div>
    </div>
  );
}

export default function RepsWrapper({
  repsData,
  districtColorByDistrict,
}: {
  repsData: RepsData;
  districtColorByDistrict?: Record<
    string,
    { fill: string; stroke: string }
  >;
}) {
  const {
    setActiveRep,
    detailBioguideId,
    closeRepDetail,
    openRepDetail,
  } = useRepStore();
  const [hoveredRowBioguideId, setHoveredRowBioguideId] = useState<
    string | null
  >(null);
  const [hoverPortraitById, setHoverPortraitById] = useState<
    Record<string, string>
  >({});

  const detailDrawerOpenRef = useRef(false);
  const repsListRef = useRef<Rep[]>([]);
  const prepareReps = (repsData: RepsData) => {
    return repsData.senateReps.concat(repsData.houseReps);
  };
  const reps = useMemo(() => prepareReps(repsData), [repsData]);
  repsListRef.current = reps;

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      reps.map((rep) =>
        resolveRepPortraitUrl(rep).then(
          (url) => [rep.bioguide_id, url] as const,
        ),
      ),
    ).then((entries) => {
      if (cancelled) return;
      setHoverPortraitById(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [reps]);

  const detailRep =
    detailBioguideId === null
      ? null
      : (reps.find((r) => r.bioguide_id === detailBioguideId) ??
        null);

  const detailDrawerOpen =
    detailBioguideId !== null && detailRep !== null;

  detailDrawerOpenRef.current = detailDrawerOpen;


  return (
    <div className={styles.main}>
      <section className={styles.namesSection}>
        <div className={styles.namesContainer}>
          <div className={styles.names}>
            <div
              className={styles.repNameNavHeader}
              role="row"
              aria-label="Columns"
            >
              <span className={styles.headerKey}>Name</span>
              <span className={styles.headerKey}>Image</span>
              <span className={styles.headerKey}>Chamber</span>
              <span className={styles.headerKey}>District</span>
              <span className={styles.headerKey}>Term</span>
            </div>
            {reps.map((rep, i) => (
              <RepNameNavRow
                key={rep.bioguide_id}
                rep={rep}
                interactive
                isActiveHoverRow={
                  hoveredRowBioguideId === rep.bioguide_id
                }
                onRowMouseEnter={() =>
                  setHoveredRowBioguideId(rep.bioguide_id)
                }
                onRowMouseLeave={() =>
                  setHoveredRowBioguideId(null)
                }
                onActivate={() => {
                  openRepDetail(rep.bioguide_id);
                }}
                hoverPortraitUrl={
                  hoverPortraitById[rep.bioguide_id] ??
                  rep.image_url?.trim() ??
                  ""
                }
                portraitAlignBottom={
                  i >= Math.ceil(reps.length / 2)
                }
                districtColorByDistrict={districtColorByDistrict}
              />
            ))}
          </div>
        </div>
      </section>
      <RepDetailDrawer
        rep={detailRep}
        open={detailBioguideId !== null && detailRep !== null}
        onOpenChange={(next) => {
          if (!next) closeRepDetail();
        }}
      />
    </div>
  );
}
