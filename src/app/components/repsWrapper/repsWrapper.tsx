"use client";

import React, { useCallback, useRef, useState } from "react";
import RepCard from "../repCard/repCard";
import styles from "./repsWrapper.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import type { RepsData } from "@/app/lib/definitions";
import Refine from "../refine/refine";
import { MaskText } from "../maskText/maskText";
import { useRepStore } from "@/app/store/useRepStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function RepsWrapper({ data }: { data: RepsData }) {
  const { setActiveRep, openRepIds } = useRepStore();
  const [refinedHouseRepId, setRefinedHouseRepId] = useState<
    string | null
  >(null);
  const [index, setIndex] = useState(0);

  const refine = useRef(data.houseReps.length > 1);
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
  const detailsLeftRef = useRef<HTMLParagraphElement>(null);
  const detailsRightRef = useRef<HTMLParagraphElement>(null);

  const addToRefArray = useCallback(
    (
      element: HTMLDivElement | null,
      array: React.RefObject<HTMLDivElement[]>,
    ) => {
      if (element && !array.current.includes(element)) {
        array.current.push(element);
      }
    },
    [],
  );

  const returnCurrentRep = (index: number, data: RepsData) => {
    if (index < data.senateReps.length) {
      return data.senateReps[index];
    } else {
      return data.houseReps[index - data.senateReps.length];
    }
  };

  const totalReps =
    data.senateReps.length +
    data.houseReps.length +
    (refine.current ? 1 : 0);

  useGSAP(
    () => {
      if (
        !data ||
        !scrollSection.current ||
        !indexRef.current ||
        !namesText.current ||
        !imagesContainer.current
      )
        return;

      // get heights of containers
      const scrollSectionHeight = scrollSection.current?.offsetHeight;
      const indexHeight = indexRef.current?.offsetHeight;
      const namesHeight = namesText.current?.offsetHeight;

      // Calculate how far each container or element need to move when selected
      // distance between top of scroll section and top of chamber text
      const moveDistanceNames = scrollSectionHeight - namesHeight;

      gsap.set(indexRef.current, {
        x: "-100%",
        autoAlpha: 0,
      });
      gsap.set(detailsLeftRef.current, { y: "100%", autoAlpha: 0 });
      gsap.set(detailsRightRef.current, { y: "100%", autoAlpha: 0 });

      gsap.set(indexTextRef.current, { textContent: "1" });
      gsap.set(indexTotalRef.current, {
        textContent: `${totalReps}`,
      });

      gsap.set(imageRefs.current, {
        rotationX: (i: number) => (i ? "-80deg" : "0deg"),
        transformOrigin: (i: number) => `center center -800px`,
      });

      ScrollTrigger.create({
        trigger: scrollSection.current,
        start: "top top",
        end: `+=${window.innerHeight * 3}px`,
        scrub: 1,
        pin: true,
        onEnter: () => {
          gsap.to(indexRef.current, {
            x: "0%",
            autoAlpha: 1,
          });
          gsap.to(detailsLeftRef.current, {
            y: "0%",
            autoAlpha: 1,
          });
          gsap.to(detailsRightRef.current, {
            y: "0%",
            autoAlpha: 1,
          });
        },
        onEnterBack: () => {},
        onLeave: () => {
          setActiveRep(null);
        },
        onLeaveBack: () => {},
        onUpdate: (self) => {
          const progress = self.progress;
          const currentIndex = Math.min(
            Math.floor(progress * totalReps),
            totalReps - 1,
          );

          gsap.set(indexTextRef.current, {
            textContent: `${currentIndex + 1}`,
          });
          gsap.set(indexTotalRef.current, {
            textContent: `${totalReps}`,
          });

          imageRefs.current.forEach((image, index) => {
            const startProgress = index / totalReps;
            const endProgress = (index + 1) / totalReps;
            const pauseThreshold = 0.1;
            const projectProgress = Math.max(
              0,
              Math.min(
                1,
                (progress - startProgress - pauseThreshold) /
                  (endProgress - startProgress - pauseThreshold),
              ),
            );
            const otherProgress = Math.max(
              0,
              Math.min(
                1,
                (progress - startProgress) /
                  (endProgress - startProgress),
              ),
            );
            const nextImage = imageRefs.current[index + 1];
            // if (!nextImage) return;

            if (
              progress >= startProgress &&
              progress <= endProgress
            ) {
              const rep = returnCurrentRep(currentIndex, data);
              setActiveRep(rep);
              setIndex(currentIndex);
              gsap.set(image, {
                rotationX: `${projectProgress * 80}deg`,
              });
              gsap.set(nextImage, {
                rotationX: `${(1 - projectProgress) * -60}deg`,
              });
            }

            gsap.set(namesTextRefs.current[index], {
              y: -otherProgress * moveDistanceNames,
            });
          });
        },
      });
    },
    { dependencies: [data.senateReps, data.houseReps] },
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
        {data.senateReps.map((senator) => (
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
        {data.houseReps.map((rep) => (
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
        className="h-[50rem] w-[65vw] rounded-full -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
        style={{
          backgroundColor: "#4d6ef0",
          width: "min(90vw, 80rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className={styles.maskTextContainer}>
          <MaskText index={index}>
            {data.senateReps.map((rep) => (
              <p key={rep.bioguide_id} className={styles.maskDetail}>
                Senate
              </p>
            ))}
            {refine.current && (
              <p key="refine" className={styles.maskDetail}>
                Refine search
              </p>
            )}
            {data.houseReps.map((rep) => (
              <p key={rep.bioguide_id} className={styles.maskDetail}>
                House of Representatives
              </p>
            ))}
          </MaskText>
        </div>

        <div ref={imagesContainer} className={styles.images}>
          <>
            {data.senateReps.map((senator) => (
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
                  multipleDistricts={data.houseReps.length > 1}
                  onRefineSuccess={(rep) =>
                    setRefinedHouseRepId(rep.bioguide_id)
                  }
                />
              </div>
            )}
            {data.houseReps.map((rep) => {
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
