"use client";
import styles from "./floatingCarousel.module.scss";
import { RefObject, useEffect } from "react";
import { useSpring, motion } from "framer-motion";
import { CarouselImage } from "./carouselImage";

type FloatingPortraitProps = {
  areaRef: RefObject<HTMLDivElement | null>;
  isHovered: boolean;
  repMap: Map<string, string>;
  hoveredIndex: number;
};

export const FloatingCarousel = ({
  areaRef,
  isHovered,
  repMap,
  hoveredIndex,
}: FloatingPortraitProps) => {
  const { x, y } = useFollowPointer(areaRef);

  const angle = (hoveredIndex * 2 * Math.PI) / repMap.size;
  const angleDegrees = angle * (180 / Math.PI);

  return (
    <motion.div
      className={styles.carousel}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={
        isHovered
          ? { opacity: 1, scale: 1 }
          : {
              scale: 0.5,
              filter: "blur(5px)",
              opacity: 0,
              transition: { delay: 0.5 },
            }
      }
      transition={{ ease: "easeOut", duration: 0.17 }}
    >
      <motion.div
        animate={{ rotateY: -angleDegrees }}
        transition={{
          ease: "backOut",
          duration: 0.7,
        }}
        className={styles.carouselStage}
      >
        {Array.from(repMap.entries()).map(([id, url], index) => (
          <CarouselImage
            key={id}
            isHovered={isHovered}
            repMap={[id, url]}
            index={index}
            numImages={repMap.size}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

const useFollowPointer = (
  areaRef: RefObject<HTMLDivElement | null>,
) => {
  const SPRING = { stiffness: 120, damping: 22 };
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  useEffect(() => {
    if (!areaRef.current) return;
    const section = areaRef.current;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const { clientX, clientY } = e;
      const xpos = clientX - rect.left - 75;
      const ypos = clientY - rect.top - 75 - 300;
      x.set(xpos);
      y.set(ypos);
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  });
  return { x, y };
};
