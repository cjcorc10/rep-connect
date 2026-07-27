"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";
import { stagger, useAnimate } from "framer-motion";
import { usePageEntrance } from "./hooks/usePageEntrance";
import { useEffect } from "react";
import { AnimatedLogo } from "./components/animatedLogo/animatedLogo";
import { Logo } from "./components/logo/logo";
import { MaskText } from "./components/maskText/maskText";
import Header from "./components/header/header";

export default function Home() {
  const { isDestination, revealComplete } = usePageEntrance();

  useEffect(() => {
    if (isDestination) revealComplete();
  }, [isDestination, revealComplete]);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "[data-animate='cover']",
      {
        height: ["0vh", "25vh", "25vh", "100vh"],
        width: [
          "0vw",
          "var(--reveal-mid-w)",
          "var(--reveal-mid-w)",
          "100vw",
        ],
      },
      {
        ease: ["backOut", "easeOut", "easeOut"],
        times: [0, 0.25, 0.75, 1],
        duration: 2.5,
        delay: 0.25,
      },
    );
    animate(
      "[data-animate='header']",
      {
        y: ["-100%", "0%"],
      },
      {
        ease: "backOut" as const,
        duration: 0.6,
        delay: 1.25,
      },
    );
    animate(
      "[data-animate='hero-child']",
      {
        opacity: [0, 1],
        y: ["10px", "0px"],
      },
      {
        ease: "easeOut" as const,
        duration: 0.5,
        staggerChildren: 0.5,
        delay: stagger(0.15, { startDelay: 3 }),
      },
    );
  }, [animate, scope]);

  return (
    <main ref={scope} className="flex flex-col relative">
      <div className={styles.setContainer}>
        <div data-animate="cover" className={styles.backgroundReveal}>
          <div
            data-animate="header"
            className={styles.headerContainer}
          >
            <Header />
          </div>
          <div
            className={styles.background}
            data-animate="background"
          >
            <div className={styles.backgroundOverlay} />
            <Image
              src="/images/protest.jpg"
              alt="kamran-abdullayev"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
      <div className={styles.heroContainer}>
        <div
          data-animate="hero-child"
          className={styles.heroTextContainer}
        >
          <MaskText>
            <h1 className={styles.heroTitle}>
              Your voice matters beyond the ballot box.
            </h1>
          </MaskText>
        </div>

        <div
          data-animate="hero-child"
          className={styles.heroSubtitleContainer}
        >
          <p className={styles.heroSubtitle}>
            Elections choose who represents you, but donors and
            lobbyists don&apos;t stop working once the votes are
            counted.{" "}
          </p>
          <p className={styles.heroSubtitle}>
            Hold your representatives{" "}
            <HighlightText>accountable</HighlightText> to the people
            they serve, not the interest groups that fund their
            campaigns. Find and contact your reps by entering your ZIP
            code below.
          </p>
        </div>
        <div data-animate="hero-child" className={styles.searchForm}>
          <SearchForm />
        </div>
      </div>
    </main>
  );
}

const HighlightText = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <span className={styles.highlightTextContainer}>
      <span className={styles.highlighter} />
      <span className={styles.highlightText}>{children}</span>
    </span>
  );
};
