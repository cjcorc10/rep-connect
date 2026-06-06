import styles from "./carousel.module.scss";
import Image from "next/image";

export const CarouselImage = ({
  repMap,
  imageSize,
}: {
  repMap: [string, string];
  imageSize: { width: number; height: number };
}) => {
  const [id, url] = repMap;

  return (
    <div
      className={styles.imageContainer}
      style={{
        height: `${imageSize.height}px`,
        width: `${imageSize.width}px`,
      }}
    >
      <div className={styles.imageHolder}>
        <Image
          src={url}
          alt={`portrait ${id}`}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </div>
    </div>
  );
};
