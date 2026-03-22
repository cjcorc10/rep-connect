"use client";

import React, { useRef, useState } from "react";
import RepCard from "../repCard/repCard";
import styles from "./repsWrapper.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import type { Rep, RepsData } from "@/app/lib/definitions";
import Refine from "../refine/refine";
import { MaskText } from "../maskText/maskText";
import { useRepStore } from "@/app/store/useRepStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const SENATE_COUNT = 2;

export default function RepsWrapper({
  repsData,
}: {
  repsData: RepsData;
}) {
  const { setActiveRep, openRepIds, getReps } = useRepStore();
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

  const addToRefArray = (
    element: HTMLDivElement | null,
    array: React.RefObject<HTMLDivElement[]>,
  ) => {
    if (element && !array.current.includes(element)) {
      array.current.push(element);
    }
  };

  const returnCurrentRep = (
    index: number,
    reps: Rep[],
    refine: boolean = false,
  ) => {
    if (index < SENATE_COUNT) return reps[index];

    if (refine) {
      if (index === SENATE_COUNT) {
        return null;
      } else {
        return reps[index - 1];
      }
    } else {
      return reps[index];
    }
  };

  const totalReps =
    repsData.senateReps.length +
    repsData.houseReps.length +
    (refine.current ? 1 : 0);

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
      const totalImages = images.length;
      currentIndexRef.current = -1;

      // get heights of containers
      const scrollSectionHeight = scrollSection.current?.offsetHeight;
      const namesHeight = namesText.current?.offsetHeight;

      // Calculate how far each container or element need to move when selected
      // distance between top of scroll section and top of chamber text
      const moveDistanceNames = scrollSectionHeight - namesHeight;

      gsap.set(indexRef.current, {
        x: "-100%",
        autoAlpha: 0,
      });

      gsap.set(indexTextRef.current, { textContent: "1" });
      gsap.set(indexTotalRef.current, {
        textContent: `${totalReps}`,
      });

      gsap.set(imageRefs.current, {
        y: (i: number) => (i ? "200%" : "0%"),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection.current,
          start: "top top",
          end: `+=${window.innerHeight * totalImages}px`,
          scrub: 1,
          pin: true,
          snap: {
            snapTo: 1 / (totalImages - 1),
            duration: 0.5,
            directional: false,
            delay: 0.1,
            ease: "power3.out",
          },
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
            const index = Math.min(
              Math.floor(progress * totalImages),
              totalImages - 1,
            );
            if (index !== currentIndexRef.current) {
              currentIndexRef.current = index;
              setActiveRep(
                returnCurrentRep(
                  index,
                  repsData.senateReps.concat(repsData.houseReps),
                  refine.current,
                ),
              );
              setIndex(index);
              gsap.set(indexTextRef.current, {
                textContent: `${index + 1}`,
              });
            }
          },
        },
      });

      images.forEach((image, i) => {
        const nextImage = images[i + 1];
        if (!nextImage) return;
        tl.to(image, {
          y: "-200%",
          ease: "none",
        });
        tl.to(
          namesTextRefs.current[i],
          {
            y: `-${moveDistanceNames}`,
            ease: "none",
          },
          "<",
        );
        tl.to(
          nextImage,
          {
            y: "0%",
            ease: "none",
          },
          "<",
        );
        tl.to(
          namesTextRefs.current[i + 1],
          {
            y: `-${moveDistanceNames / 2}`,
            ease: "none",
          },
          "<",
        );
      });
    },
    { dependencies: [repsData] },
  );

  return (
    <div ref={scrollSection} className={styles.main}>
      <div ref={indexRef} className={styles.index}>
        <h1>
          <span
            ref={indexTextRef}
            className={styles.indexNumber}
          ></span>
          <span className={styles.indexSeparator}>/</span>
          <span
            ref={indexTotalRef}
            className={styles.indexTotal}
          ></span>
        </h1>
      </div>
      <div ref={namesText} className={styles.names}>
        {repsData.senateReps.map((senator) => (
          <div
            key={senator.bioguide_id}
            ref={(el) => addToRefArray(el, namesTextRefs)}
            className={styles.repName}
          >
            <svg width="30" height="30" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="30"
                fill={`${senator.party === "Republican" ? "red" : "blue"}`}
              />
            </svg>
          </div>
        ))}
        {refine.current && (
          <div
            key="refine"
            ref={(el) => addToRefArray(el, namesTextRefs)}
            className={styles.repName}
          >
            <svg width="30" height="30" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="30" fill="black" />
            </svg>
          </div>
        )}
        {repsData.houseReps.map((rep) => (
          <div
            key={rep.bioguide_id}
            ref={(el) => addToRefArray(el, namesTextRefs)}
            className={styles.repName}
          >
            <svg width="30" height="30" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="30"
                fill={`${rep.party === "Republican" ? "red" : "blue"}`}
              />
            </svg>
          </div>
        ))}
      </div>
      <div
        // className="h-[50rem] w-[65vw] rounded-full -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
        className={styles.display}
        style={{
          backgroundColor: "var(--primary-color)",
          width: "min(90vw, 80rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className={styles.maskTextContainer}>
          <MaskText index={index}>
            {repsData.senateReps.map((rep) => (
              <p key={rep.bioguide_id} className={styles.maskDetail}>
                Senate
              </p>
            ))}
            {refine.current && (
              <p key="refine" className={styles.maskDetail}>
                Refine search
              </p>
            )}
            {repsData.houseReps.map((rep) => (
              <p key={rep.bioguide_id} className={styles.maskDetail}>
                House of Representatives
              </p>
            ))}
          </MaskText>
        </div>

        <div ref={imagesContainer} className={styles.images}>
          <>
            {repsData.senateReps.map((senator) => (
              <div
                className={styles.repCard}
                key={senator.bioguide_id}
                ref={(el) => addToRefArray(el, imageRefs)}
              >
                <RepCard
                  rep={senator}
                  isOpen={openRepIds.has(senator.bioguide_id)}
                />
              </div>
            ))}
            {refine.current && (
              <div
                className={styles.repCard}
                key="refine"
                ref={(el) => addToRefArray(el, imageRefs)}
              >
                <Refine
                  multipleDistricts={repsData.houseReps.length > 1}
                  onRefineSuccess={(rep) =>
                    setRefinedHouseRepId(rep.bioguide_id)
                  }
                />
              </div>
            )}
            {repsData.houseReps.map((rep) => {
              const disabled =
                refinedHouseRepId != null &&
                rep.bioguide_id !== refinedHouseRepId;
              return (
                <div
                  className={styles.repCard}
                  key={rep.bioguide_id}
                  ref={(el) => addToRefArray(el, imageRefs)}
                >
                  <RepCard
                    rep={rep}
                    disabled={disabled}
                    isOpen={openRepIds.has(rep.bioguide_id)}
                  />
                </div>
              );
            })}
          </>
        </div>
      </div>
    </div>
  );
}
