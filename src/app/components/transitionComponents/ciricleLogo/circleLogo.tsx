"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./circleLogo.module.scss";
import {
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
export const CircleLogo = ({
  setFinished,
  variant,
}: {
  variant: "loading" | "resting";
  setFinished?: () => void;
}) => {
  // element refs used for animatint the text around the circle
  const pathRef = useRef<SVGPathElement>(null);
  const textARef = useRef<SVGTextPathElement>(null);
  const textBRef = useRef<SVGTextPathElement>(null);

  // range ref usd for tracking the range of the gap between the two text refs
  const rangeRef = useRef<{
    connected: number;
    maxGap: number | null;
  }>({ connected: 0, maxGap: null });

  const time = useMotionValue(0);
  const gap = useTransform(time, (time) => {
    const { connected, maxGap } = rangeRef.current;
    if (!rangeRef.current || !maxGap) return 50;
    const mid = (connected + maxGap) / 2;
    const amp = (maxGap - connected) / 2;

    return mid + amp * Math.sin((time / 4000) * Math.PI * 2);
  });
  useAnimationFrame((tick) => {
    time.set(tick);
  });

  useMotionValueEvent(gap, "change", (latest) => {
    textBRef.current?.setAttribute("startOffset", `${latest}%`);
  });

  useEffect(() => {
    const path = pathRef.current;
    const textA = textARef.current;
    const textB = textBRef.current;

    if (!path || !textA || !textB) return;

    const perimeter = path.getTotalLength();
    const textALength = textA.getComputedTextLength();
    const textBLength = textB.getComputedTextLength();

    const run = async () => {
      if (!document.fonts.ready) await document.fonts.ready;
      const aPart = (textALength / perimeter) * 100;
      const bPart = (textBLength / perimeter) * 100;
      const maxGap = 100 - bPart;
      rangeRef.current = { connected: aPart, maxGap: maxGap };
    };
    run();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFinished?.();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [setFinished]);
  return (
    <div className={styles.main}>
      <motion.div
        className={styles.circle}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        data-animate="circle"
      />
      <motion.svg
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: -90 }}
        transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
        className={styles.svgContainer}
        viewBox="0 0 50 50"
      >
        <defs>
          <path
            className={styles.circlePath}
            ref={pathRef}
            id="circlePath"
            data-animate="circlePath"
            d="M 25, 7 A 18, 18 0 1, 1 24.999, 7"
            pathLength="100"
          />
        </defs>
        <g
          className={styles.group}
          style={
            {
              "--animation-duration": `${variant === "loading" ? 2 : 4}s`,
            } as React.CSSProperties
          }
        >
          <text>
            <textPath
              ref={textARef}
              href="#circlePath"
              startOffset="0"
            >
              REPC
            </textPath>
            <textPath
              ref={textBRef}
              href="#circlePath"
              startOffset="25%"
            >
              NNECT
            </textPath>
          </text>
        </g>
      </motion.svg>
    </div>
  );
};
