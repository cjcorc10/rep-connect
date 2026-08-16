import { motion, MotionValue, useTransform } from "framer-motion";
import { FollowPointer } from "../followPointer/followPointer";
import styles from "./carousel.module.scss";
import { ArrowDownIcon, ArrowRightIcon } from "@radix-ui/react-icons";

const CURSOR_TEXT_CONFIG = {
  size: { width: 100, height: 100 },
  spring: {
    stiffness: 250,
    damping: 45,
    mass: 0.5,
  },
};

const AnimationVariants = {
  initial: {
    opacity: 0,
    filter: "blur(7px)",
    y: 15,
  },
  animated: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
  },
};

export const CursorText = ({
  coords: { x, y },
  openItem,
  isFederal,
}: {
  coords: { x: MotionValue<number>; y: MotionValue<number> };
  openItem: boolean;
  isFederal: boolean;
}) => {
  const transformX = useTransform(
    x,
    (v) => v - CURSOR_TEXT_CONFIG.size.width / 2,
  );
  const transformY = useTransform(
    y,
    (v) => v - CURSOR_TEXT_CONFIG.size.height / 2,
  );
  return (
    <FollowPointer
      size={CURSOR_TEXT_CONFIG.size}
      coords={{ x: transformX, y: transformY }}
      config={CURSOR_TEXT_CONFIG.spring}
    >
      <motion.div
        className={styles.cursorText}
        variants={AnimationVariants}
        initial="initial"
        animate={openItem ? "initial" : "animated"}
        exit="initial"
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          width: CURSOR_TEXT_CONFIG.size.width,
          height: CURSOR_TEXT_CONFIG.size.height,
        }}
      >
        {isFederal ? (
          <>
            <p>Open</p>
            <ArrowDownIcon />
          </>
        ) : (
          <>
            <p>Visit Website</p>
            <ArrowRightIcon />
          </>
        )}
      </motion.div>
    </FollowPointer>
  );
};
