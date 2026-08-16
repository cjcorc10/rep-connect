import { useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

export const useFollowPointer = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const handlePointerMove = (e: PointerEvent) => {
      x.set(e.clientX - parent.getBoundingClientRect().left);
      y.set(e.clientY - parent.getBoundingClientRect().top);
    };
    parent.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => {
      parent.removeEventListener("pointermove", handlePointerMove);
    };
  }, [parentRef, x, y]);
  return { x, y, parentRef };
};
