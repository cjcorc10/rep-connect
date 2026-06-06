import {
  motion,
  MotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import carouselStyles from "../Carousel/carousel.module.scss";

type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
};

const CONFIG = {
  stiffness: 125,
  damping: 50,
  mass: 0.5,
};
export const FollowPointer = ({
  size,
  coords,
  children,
  config = CONFIG,
}: {
  size: { width: number; height: number };
  coords: { x: MotionValue<number>; y: MotionValue<number> };
  children: React.ReactNode;
  config?: SpringConfig;
}) => {
  const { width, height } = size;
  const x = useSpring(coords.x, config);
  const y = useSpring(coords.y, config);
  return (
    <motion.div
      style={{ x, y, width, height }}
      className={carouselStyles.followPointer}
    >
      {children}
    </motion.div>
  );
};
