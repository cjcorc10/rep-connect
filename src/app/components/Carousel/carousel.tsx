"use client";
import { motion, MotionValue, useTransform } from "framer-motion";
import styles from "./carousel.module.scss";
import { CarouselImage } from "./carouselImage";
import { FollowPointer } from "../followPointer/followPointer";

type FloatingPortraitProps = {
  repMap: Map<string, string>;
  coords: { x: MotionValue<number>; y: MotionValue<number> };
  hoveredIndex: number;
  openItem: boolean;
};

const CAROUSEL_CONFIG = {
  spring: {
    stiffness: 125,
    damping: 50,
    mass: 0.5,
  },
  size: { width: 400, height: 400 },
};
const animationVariants = {
  initial: { scale: 0, filter: "blur(10px)" },
  animated: {
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
  exit: {
    scale: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn" as const,
    },
  },
};

export const Carousel = ({
  coords: { x, y },
  repMap,
  hoveredIndex,
  openItem,
}: FloatingPortraitProps) => {
  const transformX = useTransform(
    x,
    (v) => v - CAROUSEL_CONFIG.size.width / 2,
  );
  const transformY = useTransform(
    y,
    (v) => v - CAROUSEL_CONFIG.size.height / 2,
  );
  return (
    <FollowPointer
      coords={{ x: transformX, y: transformY }}
      size={CAROUSEL_CONFIG.size}
      config={CAROUSEL_CONFIG.spring}
    >
      <motion.div
        className={styles.carousel}
        variants={animationVariants}
        initial="initial"
        animate={openItem ? "exit" : "animated"}
        exit="exit"
      >
        <div
          className={styles.carouselStage}
          style={{
            transform: `translateY(-${hoveredIndex * CAROUSEL_CONFIG.size.height}px)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {Array.from(repMap.entries()).map(([id, url]) => (
            <CarouselImage
              imageSize={CAROUSEL_CONFIG.size}
              key={id}
              repMap={[id, url]}
            />
          ))}
        </div>
      </motion.div>
    </FollowPointer>
  );
};
