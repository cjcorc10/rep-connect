"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import RepCard from "../repCard/repCard";
import RepDetailDrawer from "../repDetailDrawer/repDetailDrawer";
import styles from "./repsWrapper.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import type { Rep, RepsData } from "@/app/lib/definitions";
import Refine from "../refine/refine";
import { MaskText } from "../maskText/maskText";
import { useRepStore } from "@/app/store/useRepStore";
import clsx from "clsx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const SENATE_COUNT = 2;

export default function RepsWrapper({
  repsData,
}: {
  repsData: RepsData;
}) {
  const { setActiveRep, detailBioguideId, closeRepDetail } =
    useRepStore();
  const [refinedHouseRepId, setRefinedHouseRepId] = useState<
    string | null
  >(null);
  const [index, setIndex] = useState(0);

  const refine = useRef(repsData.houseReps.length > 1);
  // refs for containers of elements
  const scrollSection = useRef<HTMLDivElement>(null);
  const namesText = useRef<HTMLDivElement>(null);
  const imagesContainer = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);

  // refs for individual elements inside containers
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const namesTextRefs = useRef<HTMLDivElement[]>([]);
  const indexTextRef = useRef<HTMLSpanElement>(null);
  const indexTotalRef = useRef<HTMLSpanElement>(null);
  const currentIndexRef = useRef<number>(0);
  const progressBarOverlayRef = useRef<HTMLDivElement>(null);
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

  const reps = prepareReps(repsData);
  repsListRef.current = reps;

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
      if (detailDrawerOpen) return;
      const list = repsListRef.current;
      const st = scrollTriggerRef.current;
      const tl = timelineRef.current;
      if (!st || !tl || i < 0 || i >= list.length) return;

      const label = `rep-${list[i]!.bioguide_id}`;
      const labelTime = tl.labels[label];
      const segmentStart =
        typeof labelTime === "number" ? labelTime : i;
      const dur = tl.duration();
      if (!(dur > 0)) return;

      const progress = segmentStart / dur;
      const y = st.start + progress * (st.end - st.start);
      st.scroll(y);
      ScrollTrigger.update();
    },
    [detailDrawerOpen],
  );

  useGSAP(
    () => {
      if (
        !repsData ||
        !scrollSection.current ||
        !indexRef.current ||
        !namesText.current ||
        !imagesContainer.current
      )
        return;

      const images = imageRefs.current;
      const numImages = images.length;

      gsap.set(indexRef.current, {
        x: "-100%",
        autoAlpha: 0,
      });

      gsap.set(indexTextRef.current, { textContent: "1" });
      gsap.set(indexTotalRef.current, {
        textContent: `${totalReps}`,
      });
      gsap.set(images, {
        translateZ: (i) => (i ? "-1px" : "0px"),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection.current,
          start: "top top",
          end: `+=${window.innerHeight * numImages}px`,
          scrub: 1,
          pin: true,
          onEnter: () => {
            gsap.to(indexRef.current, {
              x: "0%",
              autoAlpha: 1,
              duration: 0.7,
              ease: "power3.out",
            });
          },
          onUpdate: (self) => {
            const progress = self.progress;

            // animate images
            animateImages(images, progress, imagesContainer.current);

            // fill in names as scroll progresses
            gsap.set(namesText.current, {
              clipPath: `inset(0 0 ${100 - progress * 100}% 0)`,
            });
            gsap.set(progressBarOverlayRef.current, {
              clipPath: `inset(0 0 ${100 - progress * 100}% 0)`,
            });

            // update index
            const index = Math.min(
              Math.floor(progress * numImages),
              numImages - 1,
            );
            if (index !== currentIndexRef.current) updateIndex(index);
          },
        },
      });

      const repsList = repsData.senateReps.concat(repsData.houseReps);
      repsList.forEach((rep, i) => {
        tl.addLabel(`rep-${rep.bioguide_id}`, i);
      });
      tl.to({}, { duration: numImages });

      const st = tl.scrollTrigger ?? null;
      if (st && detailDrawerOpenRef.current) {
        scrollPositionRef.current = st.scroll();
        st.disable(false);
      }
      return () => {
        scrollTriggerRef.current = null;
        st?.enable();
        st?.scroll(scrollPositionRef.current);
      };
    },
    { dependencies: [repsData] },
  );

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
      <div ref={indexRef} className={styles.index}>
        {/* <h1>
          <span
            ref={indexTextRef}
            className={styles.indexNumber}
          ></span>
          <span className={styles.indexSeparator}>/</span>
          <span
            ref={indexTotalRef}
            className={styles.indexTotal}
          ></span>
        </h1> */}
      </div>
      <div className={styles.maskTextContainer}>
        <MaskText index={index}>
          {repsData.senateReps.map((rep) => (
            <p key={rep.bioguide_id} className={styles.maskDetail}>
              Senate
            </p>
          ))}

          {repsData.houseReps.map((rep) => (
            <p key={rep.bioguide_id} className={styles.maskDetail}>
              House of Representatives
            </p>
          ))}
        </MaskText>
      </div>
      <section className={styles.namesSection}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} />
          <div
            ref={progressBarOverlayRef}
            className={styles.progressBarOverlay}
          />
        </div>
        <div className={styles.namesContainer}>
          <div className={styles.names}>
            {reps.map((rep, i) => (
              <div
                key={rep.bioguide_id}
                role="button"
                tabIndex={0}
                aria-label={`Scroll to ${rep.full_name}`}
                style={{
                  borderBottom:
                    i === reps.length - 1
                      ? "none"
                      : "2px solid var(--background-color)",
                }}
                className={clsx(styles.repNameNav)}
                onClick={() => scrollToRepByIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollToRepByIndex(i);
                  }
                }}
              >
                {rep.first_name[0]}. {rep.last_name}
              </div>
            ))}
          </div>
          <div ref={namesText} className={styles.namesOverlay}>
            {reps.map((rep, i) => (
              <div
                key={rep.bioguide_id}
                role="button"
                tabIndex={0}
                aria-label={`Scroll to ${rep.full_name}`}
                style={{
                  borderBottom:
                    i === reps.length - 1
                      ? "none"
                      : "2px solid var(--background-color)",
                }}
                className={clsx(styles.repNameNav)}
                onClick={() => scrollToRepByIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollToRepByIndex(i);
                  }
                }}
              >
                {rep.first_name[0]}. {rep.last_name}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div ref={imagesContainer} className={styles.images}>
        {reps.map((rep) => (
          <div
            className={styles.repCard}
            key={rep.bioguide_id}
            ref={(el) => addToRefArray(el, imageRefs)}
          >
            <RepCard rep={rep} />
          </div>
        ))}
      </div>
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
