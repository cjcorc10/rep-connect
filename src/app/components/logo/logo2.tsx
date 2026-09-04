import styles from "./logo2.module.scss";
import { MaskedText } from "../maskedText";
import { useEffect, useRef } from "react";

const logoText1 = "repc";
const logoText2 = "nnect";

export const Logo2 = ({
  variant = "hero",
}: {
  variant: "hero" | "header";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const clipPath =
    variant === "hero" ? "inset(0 0 0 100%)" : "inset(0 0 0 0)";

  useEffect(() => {
    if (
      backgroundRef.current &&
      separatorRef.current &&
      containerRef.current
    ) {
      const containerRect =
        containerRef.current.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerTop = containerRect.top;
      const separatorRect =
        separatorRef.current.getBoundingClientRect();
      const separatorx = separatorRect.left;
      const separatory = separatorRect.top + separatorRect.height / 2;
      console.log(
        containerLeft,
        containerTop,
        separatorx,
        separatory,
      );
      backgroundRef.current.style.transform = `translate(${separatorx - containerLeft}px, ${separatory - containerTop}px)`;
    }
  });
  return (
    <div
      className={styles.logo}
      ref={containerRef}
      data-animate="logo"
    >
      <div className={styles.backgroundContainer}>
        <div className={styles.backgroundSlot} ref={backgroundRef}>
          <div
            className={styles.background}
            data-animate="logo-background"
            style={{ clipPath }}
          />
        </div>
      </div>
      <div
        className={styles.textContainer}
        data-animate="logo-text-container"
      >
        <div className={styles.logoText} data-animate="logo-text-1">
          <MaskedText text={logoText1} name="logo" />
        </div>
        <div
          className={styles.separator}
          data-animate="logo-separator"
        />
        <div
          ref={separatorRef}
          className={styles.logoText}
          data-animate="logo-text-2"
        >
          <MaskedText text={logoText2} name="logo" />
        </div>
      </div>
    </div>
  );
};
