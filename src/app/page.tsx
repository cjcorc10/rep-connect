"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";
import { useAnimate } from "framer-motion";
import { usePageEntrance } from "./hooks/usePageEntrance";
import { useEffect } from "react";
import { Logo } from "./components/logo/logo";
import { MaskText } from "./components/maskText/maskText";
import { Wipe } from "./components/transitionComponents/wipe/wipe";
import Header from "./components/header/header";

export default function Home() {
  const title1 = "repc";
  const title2 = "nnect";
  const charsCount = [...title1.split(""), ...title2.split("")]
    .length;
  const middleIndex = Math.floor(charsCount / 2);

  const { isDestination, revealComplete } = usePageEntrance();

  useEffect(() => {
    if (isDestination) revealComplete();
  }, [isDestination, revealComplete]);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "[data-animate='logo-char-container']",
      {
        y: ["150%", "0%"],
      },
      {
        ease: "easeOut",
        duration: 0.4,
        delay: (i) => Math.abs(i - middleIndex) * 0.05 + 0.1,
      },
    );

    animate(
      "[data-animate='logo-circle']",
      {
        clipPath: ["circle(0% at 50% 50%)", "circle(50% at 50% 50%)"],
      },
      {
        ease: "easeOut",
        delay: 1,
      },
    );
    animate(
      "[data-animate='logo']",
      {
        columnGap: ["0rem", "8rem", "8rem", "3rem"],
        fontSize: ["6rem", "6rem", "6rem", "3rem"],
      },
      {
        ease: ["easeOut", "easeOut", "easeOut", "easeOut"],
        times: [0, 0.25, 0.7, 1],
        duration: 1,
        delay: 0.9,
      },
    );
    animate(
      "[data-animate='logo-container']",
      {
        top: ["30%", "5%"],
      },
      {
        ease: "easeOut",
        delay: 1.6,
        duration: 0.15,
      },
    );

    animate(
      "[data-animate='background-wipe']",
      {
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
      },
      {
        ease: "easeInOut",
        duration: 0.4,
        delay: (i) => i * 0.5 + 1.6,
      },
    );
    animate(
      "[data-animate='background']",
      {
        clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
      },
      {
        ease: "easeInOut",
        delay: 2.25,
        duration: 0.3,
      },
    );
    animate(
      "[data-animate='header-line']",
      {
        clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
      },
      {
        ease: "easeInOut",
        duration: 1.7,
        delay: 2,
      },
    );
    animate(
      "[data-animate='about-char']",
      {
        x: ["-100%", "0%"],
      },
      {
        ease: "easeOut",
        duration: 0.5,
        delay: (i) => i * 0.05 + 3.3,
      },
    );
    animate(
      "[data-animate='search-form']",
      {
        clipPath: [
          "inset(0% 100% 100% 0% round 8px)",
          "inset(0% 0% 0% 0% round 8px)",
        ],
      },
      {
        ease: "easeOut",
        duration: 0.7,
        delay: 3,
      },
    );
  }, [animate, scope, middleIndex]);

  return (
    <main ref={scope} className="flex flex-col relative h-screen">
      <div
        data-animate="logo-container"
        className={styles.logoContainer}
      >
        <Logo />
      </div>
      <div
        className={styles.headerContainer}
        data-animate="header-container"
      >
        <Header />
      </div>
      <Wipe />
      <div data-animate="header-line" className={styles.headerLine} />
      <div className={styles.background} data-animate="background">
        <div className={styles.backgroundOverlay} />
        <Image
          src="/images/protest.jpg"
          alt="kamran-abdullayev"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div
        className={styles.heroContainer}
        data-animate="background-content"
      >
        <div
          data-animate="hero-child"
          className={styles.heroTextContainer}
        >
          <MaskText direction="down" delay={2.5} wordStagger={0.05}>
            <h1 className={styles.heroTitle}>
              Your voice matters beyond the ballot box.
            </h1>
          </MaskText>
        </div>

        <div
          data-animate="hero-child"
          className={styles.heroSubtitleContainer}
        >
          <MaskText direction="down" delay={2.7}>
            <p className={styles.heroSubtitle}>
              Elections choose who represents you, but donors and
              lobbyists don&apos;t stop working once the votes are
              counted. Hold your representatives accountable to the
              people they serve. Find and contact your reps by
              entering your ZIP code below.
            </p>
          </MaskText>
        </div>

        <div className={styles.searchForm}>
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
