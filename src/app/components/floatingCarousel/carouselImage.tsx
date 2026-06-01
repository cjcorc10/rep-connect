import styles from "./floatingCarousel.module.scss";
import { calculateCarouselPosition } from "@/app/lib/floatingCarousel";
import { motion } from "framer-motion";
import Image from "next/image";

export const CarouselImage = ({
  repMap,
  numImages,
  index,
  imageHeight = 150,
}: {
  repMap: [string, string];
  numImages: number;
  index: number;
  imageHeight?: number;
}) => {
  const position = calculateCarouselPosition(numImages, index);
  const [id, url] = repMap;

  console.log(url);
  return (
    <motion.div
      className={styles.imageCard}
      initial={false}
      animate={{
        y: [15, -15, 15],
        translateX: position.x,
        translateZ: position.z,
        rotateY: position.rotationY,
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        delay: index * 0.25,
      }}
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
