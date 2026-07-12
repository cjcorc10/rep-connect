import { useEffect, useRef, useState } from "react";
import styles from "./logo.module.scss";
import { useAnimate } from "framer-motion";

export const Logo = () => {
  const string1 = "ep";
  const string2 = "onnect";
  const letterSpacing = 38;

  const [scope, animate] = useAnimate();

  const animationRun = useRef(false);
  const handleMouseEnter = () => {
    if (animationRun.current) return;
    animationRun.current = true;
    animate(
      "[data-animate=shapes]",
      {
        rotate: [0, 720],
      },
      {
        type: "spring",
        stiffness: 50,
        damping: 8,
      },
    );

    animate(
      "[data-animate=cCircle]",
      {
        y: [0, 50],
        x: [0, 2],
      },
      {
        type: "spring",
        stiffness: 170,
        damping: 15,
        delay: 1,
      },
    );
    animate(
      "[data-animate=cCircle]",
      {
        rotate: [0, -200],
      },
      {
        delay: 1.6,
        type: "spring",
        stiffness: 170,
        damping: 15,
      },
    );

    string1.split("").forEach((letter, index) => {
      animate(
        `[data-animate=rText-${index}]`,
        {
          y: [0, 56],
          x: [-2, 0],
        },
        {
          type: "spring",
          stiffness: 170,
          damping: 15,
          delay: 1 + index * 0.05,
        },
      );
    });
    string2.split("").forEach((letter, index) => {
      animate(
        `[data-animate=cText-${index}]`,
        {
          y: [0, -58],
          x: [-2, 0],
        },
        {
          type: "spring",
          stiffness: 170,
          damping: 15,
          delay: 1.5 + index * 0.05,
        },
      );
    });
  };
  return (
    <div className={styles.logoContainer}>
      <svg
        className={styles.logoSVG}
        viewBox="0 0 300 100"
        fill="none"
      >
        <g ref={scope}>
          <g
            data-animate="shapes"
            className={styles.shapes}
            onMouseEnter={handleMouseEnter}
          >
            <circle
              className={styles.cCircle}
              data-animate="cCircle"
              cx="25"
              cy="25"
              r="15"
              pathLength="100"
            />
            <g data-animate="rGroup">
              <circle
                className={styles.rCircle}
                data-animate="rCircle"
                cx="25"
                cy="25"
                r="15"
                pathLength="100"
              />
              <path
                className={styles.rShaft}
                data-animate="rShaft"
                d="M 10 25 v 17"
              />
            </g>
          </g>
          <g data-animate="textGroup">
            {string1.split("").map((letter, index) => (
              <text
                key={index}
                x={index * letterSpacing + 27}
                y="-14"
                className={styles.text}
                data-animate={`rText-${index}`}
              >
                {letter}
              </text>
            ))}
            {string2.split("").map((letter, index) => (
              <text
                key={index}
                x={index * letterSpacing + 39}
                y="150"
                className={styles.text}
                data-animate={`cText-${index}`}
              >
                {letter}
              </text>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
