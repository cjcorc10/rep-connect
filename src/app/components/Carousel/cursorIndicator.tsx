import styles from "./carousel.module.scss";

import { motion, MotionValue, useTransform } from "framer-motion";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { FollowPointer } from "../followPointer/followPointer";

const CURSOR_CONFIG = {
  spring: {
    stiffness: 200,
    damping: 45,
    mass: 0.5,
  },
  size: { width: 100, height: 100 },
};
const animationVariants = {
  initial: {
    scale: 0,
    rotate: 0,
    transition: { duration: 0.5 },
  },
  animated: { scale: 1, rotate: 360 },
  exit: {},
};

export const CursorIndicator = ({
  coords: { x, y },
  openItem,
}: {
  coords: { x: MotionValue<number>; y: MotionValue<number> };
  openItem: boolean;
}) => {
  const transformX = useTransform(
    () => x.get() - CURSOR_CONFIG.size.width / 2,
  );
  const transformY = useTransform(
    () => y.get() - CURSOR_CONFIG.size.height / 2,
  );
  return (
    <FollowPointer
      size={CURSOR_CONFIG.size}
      coords={{ x: transformX, y: transformY }}
      config={CURSOR_CONFIG.spring}
    >
      <motion.div
        variants={animationVariants}
        initial="initial"
        animate={{ scale: openItem ? 0.5 : 1 }}
        exit="initial"
        transition={{ ease: "easeOut", duration: 0.5 }}
        className={styles.cursorIndicator}
        style={{
          width: CURSOR_CONFIG.size.width,
          height: CURSOR_CONFIG.size.height,
        }}
      />
    </FollowPointer>
  );
};
