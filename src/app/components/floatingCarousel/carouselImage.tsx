import styles from "./floatingCarousel.module.scss";
import { calculateCarouselPosition } from "@/app/lib/floatingCarousel";
import { motion } from "framer-motion";
import Image from "next/image";

export const CarouselImage = ({
  repMap,
  numImages,
  index,
  imageHeight = 150,
  isHovered,
}: {
  repMap: [string, string];
  numImages: number;
  index: number;
  imageHeight?: number;
  isHovered: boolean;
}) => {
  const position = calculateCarouselPosition(numImages, index);
  const [id, url] = repMap;
  const AnimationVariants = {
    initial: {
      x: 0,
      z: -index * 20,
      rotateY: index === 0 ? 0 : 180,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    hydrated: {
      x: position.x,
      z: position.z,
      rotateY: position.rotationY,
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={styles.imageCard}
      variants={AnimationVariants}
      animate={isHovered ? "hydrated" : "initial"}
      style={
        {
          "--index": index,
          height: `${imageHeight}px`,
          // transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateY(${position.rotationY}deg)`,
        } as React.CSSProperties
      }
    >
      <div className={styles.imageBack} />
      <div className={styles.imageBase} />
      <div className={styles.imageContainer}>
        <Image
          src={url}
          alt={`portrait ${id}`}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </motion.div>
  );
};
