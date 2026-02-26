"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import RepCard from "../repCard/repCard";
import RepDetailCard from "../repDetailCard/repDetailCard";
import styles from "./repsWrapper.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import gsap from "gsap";
import type { RepsData } from "@/app/lib/definitions";
import { useActiveRep } from "../activeRepContext";
import Refine from "../refine/refine";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function RepsWrapper({ data }: { data: RepsData }) {
  const { activeRep, setActiveRep, isOpen, setIsOpen } =
    useActiveRep();
  const [refinedHouseRepId, setRefinedHouseRepId] = useState<
    string | null
  >(null);

  const refine = useRef(data.houseReps.length > 1);
  // refs for containers of elements
  const scrollSection = useRef<HTMLDivElement>(null);
  const namesText = useRef<HTMLDivElement>(null);
  const imagesContainer = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);

  // refs for individual elements inside containers
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const namesTextRefs = useRef<HTMLDivElement[]>([]);
  const indexTextRef = useRef<HTMLHeadingElement>(null);
  const indexTotalRef = useRef<HTMLSpanElement>(null);
  const detailsLeftRef = useRef<HTMLParagraphElement>(null);
  const detailsRightRef = useRef<HTMLDivElement>(null);

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

  const totalReps = data.senateReps.length + data.houseReps.length;

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
      const imagesContainerHeight =
        imagesContainer.current?.offsetHeight;

      // Calculate how far each container or element need to move when selected
      // distance between top of scroll section and top of chamber text
      const moveDistanceIndex = scrollSectionHeight - indexHeight;
      const moveDistanceNames = scrollSectionHeight - namesHeight;

      const indexText = SplitText.create(indexRef.current, {
        type: "lines",
        mask: "lines",
      });
      const contactsText = SplitText.create(detailsRightRef.current, {
        type: "lines",
        mask: "lines",
      });
      const chamberText = SplitText.create(detailsLeftRef.current, {
        type: "lines",
        mask: "lines",
      });
      gsap.set(contactsText.lines, {
        x: " -100%",
        autoAlpha: 0,
      });
      gsap.set(chamberText.lines, {
        x: "100%",
        autoAlpha: 0,
      });

      gsap.set(indexText.lines, {
        x: "-100%",
        autoAlpha: 0,
      });

      gsap.set(imageRefs.current, {
        translateY: (i: number) => (i ? "70vh" : "0vh"),
      });

      ScrollTrigger.create({
        trigger: scrollSection.current,
        start: "top top",
        end: `+=${window.innerHeight * 3}px`,
        scrub: 1,
        pin: true,
        onEnter: () => {
          gsap.to(contactsText.lines, {
            x: "0%",
            autoAlpha: 1,
          });
          gsap.to(chamberText.lines, {
            x: "0%",
            autoAlpha: 1,
          });
          gsap.to(indexText.lines, {
            x: "0%",
            autoAlpha: 1,
          });
        },
        onEnterBack: () => {
          gsap.to(contactsText.lines, { x: "0%" });
          gsap.to(chamberText.lines, { x: "0%" });
        },
        onLeave: () => {
          gsap.to(contactsText.lines, { x: "-100%" });
          gsap.to(chamberText.lines, { x: "100%" });
          setActiveRep(null);
          setIsOpen(false);
        },
        onLeaveBack: () => {
          setActiveRep(null);
          setIsOpen(false);
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const currentIndex = Math.min(
            Math.floor(progress * totalReps),
            totalReps,
          );

          gsap.set(indexTextRef.current, {
            textContent: `${currentIndex + 1}`,
          });
          gsap.set(indexTotalRef.current, {
            textContent: `${totalReps}`,
          });
          gsap.set(indexRef.current, {
            y: progress * moveDistanceIndex,
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
            if (!nextImage) return;

            if (
              progress >= startProgress &&
              progress <= endProgress
            ) {
              setActiveRep(returnCurrentRep(currentIndex, data));
              gsap.set(image, { y: `${projectProgress * -70}vh` });
              gsap.set(nextImage, {
                y: `${(1 - projectProgress) * 70}vh`,
              });
              gsap.to(namesTextRefs.current[index], {
                opacity: 1,
              });
            }
            gsap.set(namesTextRefs.current[index], {
              y: -otherProgress * moveDistanceNames,
            });
          });
        },
      });
    },
    { dependencies: [data] },
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
            {senator.full_name}
          </div>
        ))}
        {/* {refine.current && (
          <div
            key="refine"
            ref={(el) => addToRefArray(el, namesTextRefs)}
            className={styles.repName}
          >
            Refine?
          </div>
        )} */}
        {data.houseReps.map((rep) => (
          <div
            key={rep.bioguide_id}
            ref={(el) => addToRefArray(el, namesTextRefs)}
            className={styles.repName}
          >
            {rep.full_name}
          </div>
        ))}
      </div>
      <p ref={detailsLeftRef} className={styles.detailsLeft}>
        Senate
      </p>
      <p ref={detailsRightRef} className={styles.detailsRight}>
        {data.senateReps[0].state}
      </p>
      <div
        className="h-[80vh] w-[65vw] rounded-full -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
        style={{
          backgroundColor: "#4d6ef0",
          width: "min(90vw, 80rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div ref={imagesContainer} className={styles.images}>
          <>
            {data.senateReps.map((senator) => (
              <div
                className={styles.repCard}
                key={senator.bioguide_id}
                ref={(el) => addToRefArray(el, imageRefs)}
              >
                {isOpen &&
                senator.bioguide_id === activeRep?.bioguide_id ? (
                  <RepDetailCard
                    rep={senator}
                    positionLabel={`${senator.state} Senate`}
                  />
                ) : (
                  <>
                    <RepCard rep={senator} />
                    <div className={styles.nameSection}>
                      {" "}
                      {senator.full_name}{" "}
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* {refine.current && (
              <Refine
                multipleDistricts={data.houseReps.length > 1}
                onRefineSuccess={(rep) =>
                  setRefinedHouseRepId(rep.bioguide_id)
                }
              />
            )} */}
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
                  {isOpen &&
                  !disabled &&
                  rep.bioguide_id === activeRep?.bioguide_id ? (
                    <RepDetailCard
                      rep={rep}
                      positionLabel={`District ${rep.district}`}
                    />
                  ) : (
                    <>
                      <RepCard rep={rep} disabled={disabled} />
                      <div className={styles.nameSection}>
                        {" "}
                        {rep.full_name}{" "}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        </div>
      </div>
    </div>
  );
}
