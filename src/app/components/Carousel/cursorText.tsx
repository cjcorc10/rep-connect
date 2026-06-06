import { motion, MotionValue, useTransform } from "framer-motion";
import { FollowPointer } from "../followPointer/followPointer";
import styles from "./carousel.module.scss";
import { ArrowDownIcon } from "@radix-ui/react-icons";

const CURSOR_TEXT_CONFIG = {
  size: { width: 100, height: 100 },
  spring: {
    stiffness: 250,
    damping: 45,
    mass: 0.5,
  },
};

export const CursorText = ({
  coords: { x, y },
  openItem,
}: {
  coords: { x: MotionValue<number>; y: MotionValue<number> };
  openItem: boolean;
}) => {
  const transformX = useTransform(
    () => x.get() - CURSOR_TEXT_CONFIG.size.width / 2,
  );
  const transformY = useTransform(
    () => y.get() - CURSOR_TEXT_CONFIG.size.height / 2,
  );
  return (
    <FollowPointer
      size={CURSOR_TEXT_CONFIG.size}
      coords={{ x: transformX, y: transformY }}
      config={CURSOR_TEXT_CONFIG.spring}
    >
      <motion.div
        className={styles.cursorText}
        style={{
          width: CURSOR_TEXT_CONFIG.size.width,
          height: CURSOR_TEXT_CONFIG.size.height,
        }}
      >
        <p>Open</p>
        <ArrowDownIcon />
      </motion.div>
    </FollowPointer>
  );
};
