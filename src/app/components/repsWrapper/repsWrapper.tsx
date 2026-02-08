"use client";

import { useRef } from "react";
import RepCard from "../repCard/repCard";
import styles from "./repsWrapper.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import type { RepsData } from "@/app/lib/definitions";

export default function RepsWrapper({ data }: { data: RepsData }) {
  gsap.registerPlugin(ScrollTrigger);

  // refs for containers of elements
  const scrollSection = useRef<HTMLDivElement>(null);
  const namesText = useRef<HTMLDivElement>(null);
  const imagesContainer = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);

  // refs for individual elements inside containers
  const imageRefs = useRef<HTMLDivElement[]>([]);
  const namesTextRefs = useRef<HTMLDivElement[]>([]);
  const indexTextRef = useRef<HTMLHeadingElement>(null);

  // function to add element to given ref array
  const addToRefArray = (
    element: HTMLDivElement | null,
    array: React.RefObject<HTMLDivElement[]>
  ) => {
    if (element && !array.current.includes(element)) {
      array.current.push(element);
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
      const moveDistanceImages =
        window.innerHeight - imagesContainerHeight;
      const imageActivationThreshold = window.innerHeight / 2;

      gsap.from("h1", {
        y: "100%",
      });

      ScrollTrigger.create({
        trigger: scrollSection.current,
        start: "top top",
        end: `+=${window.innerHeight * 3}px`,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentIndex = Math.min(
            Math.floor(progress * totalReps),
            totalReps - 1
          );
          // change index depending on progress
          gsap.set(indexTextRef.current, {
            textContent: `${currentIndex + 1}`,
          });
          // move index container
          gsap.set(indexRef.current, {
            y: progress * moveDistanceIndex,
          });
          // move images container
          gsap.set(imagesContainer.current, {
            y: progress * moveDistanceImages,
          });

          // focus on images that are in the center of the viewport
          imageRefs.current.forEach((image) => {
            const imgRect = image.getBoundingClientRect();
            const imgTop = imgRect.top;
            const imgBottom = imgRect.bottom;

            if (
              imgTop <= imageActivationThreshold &&
              imgBottom >= imageActivationThreshold
            ) {
              gsap.to(image, {
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
              });
            } else {
              gsap.to(image, {
                opacity: 0.5,
                duration: 0.5,
                ease: "power3.out",
              });
            }
          });

          namesTextRefs.current.forEach((name, index) => {
            // when should this name start and end moving
            const startProgress = index / totalReps;
            const endProgress = (index + 1) / totalReps;

            const projectProgress = Math.max(
              0,
              Math.min(
                1,
                (progress - startProgress) /
                  (endProgress - startProgress)
              )
            );

            gsap.set(name, {
              y: -projectProgress * moveDistanceNames,
            });
          });
        },
      });
    },
    { dependencies: [data] }
  );

  return (
    <div ref={scrollSection} className={styles.main}>
      <div ref={indexRef} className={styles.index}>
        <h1>
          <span ref={indexTextRef} className={styles.indexNumber}>
            1
          </span>
          /{totalReps}
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
      <div ref={imagesContainer} className={styles.images}>
        {data.senateReps.map((senator) => (
          <div
            className={styles.repCard}
            key={senator.bioguide_id}
            ref={(el) => addToRefArray(el, imageRefs)}
          >
            <RepCard rep={senator} />
          </div>
        ))}
        {data.houseReps.map((rep) => (
          <div
            className={styles.repCard}
            key={rep.bioguide_id}
            ref={(el) => addToRefArray(el, imageRefs)}
          >
            <RepCard rep={rep} />
          </div>
        ))}
      </div>
    </div>
  );
}
