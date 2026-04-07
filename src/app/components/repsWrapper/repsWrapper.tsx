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
          sizes="(max-width: 768px) 90vw, min(36vw, 28rem)"
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
}: {
  rep: Rep;
  interactive: boolean;
  onActivate?: () => void;
  isActiveHoverRow: boolean;
  onRowMouseEnter: () => void;
  onRowMouseLeave: () => void;
  hoverPortraitUrl: string;
  portraitAlignBottom: boolean;
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
        <span className={styles.colValue}>{district}</span>
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
}: {
  repsData: RepsData;
}) {
  const {
    setActiveRep,
    detailBioguideId,
    closeRepDetail,
    openRepDetail,
  } = useRepStore();
  const [refinedHouseRepId, setRefinedHouseRepId] = useState<
    string | null
  >(null);
  const [index, setIndex] = useState(0);
  const [hoveredRowBioguideId, setHoveredRowBioguideId] = useState<
    string | null
  >(null);
  const [hoverPortraitById, setHoverPortraitById] = useState<
    Record<string, string>
  >({});

  const refine = useRef(repsData.houseReps.length > 1);
  // refs for containers of elements
  const scrollSection = useRef<HTMLDivElement>(null);
  const imagesContainer = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);

  // refs for individual elements inside containers
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const namesTextRefs = useRef<HTMLDivElement[]>([]);
  const indexTextRef = useRef<HTMLSpanElement>(null);
  const indexTotalRef = useRef<HTMLSpanElement>(null);
  const currentIndexRef = useRef<number>(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollPositionRef = useRef<number>(0);
  const detailDrawerOpenRef = useRef(false);
  const repsListRef = useRef<Rep[]>([]);
  const prepareReps = (repsData: RepsData) => {
    return repsData.senateReps.concat(repsData.houseReps);
  };

  const addToRefArray = (
    element: HTMLDivElement | null,
    array: React.RefObject<HTMLDivElement[]>,
  ) => {
    if (element && !array.current.includes(element)) {
      array.current.push(element);
    }
  };

  const updateIndex = (index: number) => {
    setIndex(index);
    setActiveRep(reps[index]);
    gsap.set(indexTextRef.current, {
      textContent: `${index + 1}`,
    });
    currentIndexRef.current = index;
  };

  const getPrimaryCards = (
    index: number,
    images: HTMLDivElement[],
  ) => [images[index], images[index + 1] || images[0]];
  const getBackgroundCards = (
    index: number,
    images: HTMLDivElement[],
  ) => {
    if (index === images.length - 1) return images.slice(1, index);
    return [...images.slice(index + 2), ...images.slice(0, index)];
  };

  const animateImages = (
    images: HTMLDivElement[],
    progress: number,
    imageContainer: HTMLDivElement | null,
  ) => {
    images.forEach((image, i) => {
      const numImages = images.length;
      const primaryCards = getPrimaryCards(i, images);
      const backgroundCards = getBackgroundCards(i, images);

      // get start and end of each segment
      const segmentLength = 1 / images.length;
      const startProgress = i * segmentLength;
      const endProgress = startProgress + segmentLength;
      const localProgress =
        (progress - startProgress) / segmentLength;

      if (progress > startProgress && progress < endProgress) {
        gsap.to(primaryCards, {
          translateY: (k) => (k === 0 ? `0%` : `${30}%`),
          translateZ: (k) => (k ? `${numImages * -30}px` : "0px"),
        });
        gsap.to(backgroundCards, {
          translateY: (k) => `${(numImages - 2 - k) * -15}%`,
          translateZ: (k) => `${(numImages - 2 - k) * -30}px`,
        });
        if (!imageContainer) return;
        gsap.to(imageContainer, {
          yPercent: localProgress * -10,
          ease: "power3.out",
        });
      }
    });
  };

  const totalReps =
    repsData.senateReps.length +
    repsData.houseReps.length +
    (refine.current ? 1 : 0);

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

  const scrollToRepByIndex = useCallback(
    (i: number) => {
      const st = scrollTriggerRef.current;
      if (!st) return;
      const n = reps.length;
      if (n === 0) return;
      const progress = n === 1 ? 0 : (i + 0.5) / n;
      const target = st.start + progress * (st.end - st.start);
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [reps.length],
  );

  // useGSAP(
  //   () => {
  //     if (!repsData || !scrollSection.current) return;

  //     const images = imageRefs.current;
  //     const numSegments = Math.max(reps.length, 1);

  //     if (indexRef.current) {
  //       gsap.set(indexRef.current, {
  //         x: "-100%",
  //         autoAlpha: 0,
  //       });
  //     }

  //     if (indexTextRef.current) {
  //       gsap.set(indexTextRef.current, { textContent: "1" });
  //     }
  //     if (indexTotalRef.current) {
  //       gsap.set(indexTotalRef.current, {
  //         textContent: `${totalReps}`,
  //       });
  //     }
  //     if (images.length > 0) {
  //       gsap.set(images, {
  //         translateZ: (i) => (i ? "-1px" : "0px"),
  //       });
  //     }

  //     const scrollExtra =
  //       window.innerHeight * numSegments;
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: scrollSection.current,
  //         start: "top top",
  //         end: `+=${scrollExtra}px`,
  //         scrub: 1,
  //         pin: true,
  //         onEnter: () => {
  //           if (indexRef.current) {
  //             gsap.to(indexRef.current, {
  //               x: "0%",
  //               autoAlpha: 1,
  //               duration: 0.7,
  //               ease: "power3.out",
  //             });
  //           }
  //         },
  //         onUpdate: (self) => {
  //           const progress = self.progress;
  //           const panTarget =
  //             imagesContainer.current ?? scrollSection.current;

  //           if (images.length > 0) {
  //             animateImages(
  //               images,
  //               progress,
  //               panTarget,
  //             );
  //           }

  //           const index = Math.min(
  //             Math.floor(progress * numSegments),
  //             numSegments - 1,
  //           );
  //           if (index !== currentIndexRef.current) {
  //             updateIndex(index);
  //           }
  //         },
  //       },
  //     });

  //     const repsList = repsData.senateReps.concat(
  //       repsData.houseReps,
  //     );
  //     repsList.forEach((rep, i) => {
  //       tl.addLabel(`rep-${rep.bioguide_id}`, i);
  //     });

  //     const st = tl.scrollTrigger ?? null;
  //     scrollTriggerRef.current = st;

  //     if (st && detailDrawerOpenRef.current) {
  //       scrollPositionRef.current = st.scroll();
  //       st.disable(false);
  //     }
  //     return () => {
  //       scrollTriggerRef.current = null;
  //       st?.enable();
  //       st?.scroll(scrollPositionRef.current);
  //     };
  //   },
  //   { dependencies: [repsData, reps.length, totalReps] },
  // );

  useEffect(() => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    if (detailDrawerOpen) {
      scrollPositionRef.current = st.scroll();
      st.disable(false);
    } else {
      st.enable();
      st.scroll(scrollPositionRef.current);
    }
  }, [detailDrawerOpen]);

  return (
    <div ref={scrollSection} className={styles.main}>
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
                  scrollToRepByIndex(i);
                }}
                hoverPortraitUrl={
                  hoverPortraitById[rep.bioguide_id] ??
                  rep.image_url?.trim() ??
                  ""
                }
                portraitAlignBottom={
                  i >= Math.ceil(reps.length / 2)
                }
              />
            ))}
          </div>
        </div>
      </section>
      {/* <div ref={imagesContainer} className={styles.images}>
        {reps.map((rep) => (
          <div
            className={styles.repCard}
            key={rep.bioguide_id}
            ref={(el) => addToRefArray(el, imageRefs)}
          >
            <RepCard rep={rep} />
          </div>
        ))}
      </div> */}
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
