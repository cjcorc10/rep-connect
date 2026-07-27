"use client";
import styles from "./submitButton.module.scss";
import { AnimationOptions, useAnimate } from "framer-motion";
export default function SubmitButton() {
  const [scope, animate] = useAnimate();
  const SPRING_CONFIG = {
    type: "spring",
    stiffness: 250,
    damping: 15,
  };

  const handleHover = () => {
    animate(
      '[data-attribute="shaft"]',
      { d: "M 5, 10 h 11" },
      SPRING_CONFIG as AnimationOptions,
    );
    animate(
      '[data-attribute="point"]',
      { d: "M 12, 7 l 4, 3 l -4, 3" },
      SPRING_CONFIG as AnimationOptions,
    );

    setTimeout(() => {
      animate(
        '[data-attribute="shaft"]',
        { d: "M 5, 10 h 8" },
        SPRING_CONFIG as AnimationOptions,
      );
      animate(
        '[data-attribute="point"]',
        { d: "M 10, 6 l 3, 4 l -3, 4" },
        SPRING_CONFIG as AnimationOptions,
      );
    }, 200);
  };

  return (
    <button
      type="submit"
      className={styles.submitButton}
      ref={scope}
      onMouseEnter={handleHover}
      onClick={handleHover}
    >
      <svg
        viewBox="0 0 20 20"
        className={styles.submitButtonIcon}
        fill="none"
      >
        <path
          data-attribute="shaft"
          d="M 5, 10 h 8"
          stroke="white"
          fill="none"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          data-attribute="point"
          d="M 10, 6 l 3, 4 l -3, 4"
          stroke="white"
          fill="none"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
