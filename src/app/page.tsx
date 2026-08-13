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
import { type Phase } from "./store/usePageTransition";

export default function Home() {
  const { phase, transitionId } = usePageEntrance();

  return <HomeEntrance key={transitionId} phase={phase} />;
}

const HomeEntrance = ({ phase }: { phase: Phase }) => {
  const title1 = "repc";
  const title2 = "nnect";
  const charsCount = [...title1.split(""), ...title2.split("")]
    .length;
  const middleIndex = Math.floor(charsCount / 2);

  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (phase !== "idle") return;
    let cancelled = false;

    (async () => {
      await Promise.all([
        animate(
          "[data-animate='about-char']",
          {
            x: "-100%",
          },
          {
            duration: 0,
          },
        ),
        animate(
          "[data-animate='logo-char-container']",
          {
            y: "0%",
          },
          {
            duration: 0,
          },
        ),
      ]);

      await animate(
        "[data-animate='logo-char-container']",
        {
          y: ["150%", "0%"],
        },
        {
          ease: "easeOut",
          duration: 0.5,
          delay: (i) => Math.abs(i - middleIndex) * 0.07 + 0.15,
        },
      );
      if (cancelled) return;

      await Promise.all([
        animate(
          "[data-animate='logo-circle']",
          {
            clipPath: [
              "circle(0 at 50% 50%)",
              "circle(0.5em at 50% 50%)",
              "circle(0.5em at 50% 50%)",
            ],
          },
          {
            ease: "easeOut",
            duration: 0.6,
            delay: 0.5,
          },
        ),
        animate(
          "[data-animate='logo']",
          {
            columnGap: ["0em", "2em", "2em"],
          },
          {
            ease: "easeOut",
            duration: 0.6,
            delay: 0.4,
          },
        ),
      ]);
      await Promise.all([
        animate(
          "[data-animate='logo']",
          {
            columnGap: "1.5em",
            scale: 0.6,
          },
          {
            ease: "easeOut",
            duration: 0.3,
          },
        ),
        animate(
          "[data-animate='logo-container']",
          {
            top: "0%",
          },
          {
            ease: "easeOut",
            duration: 0.2,
          },
        ),
        animate(
          "[data-animate='background-wipe']",
          {
            clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
          },
          {
            type: "spring",
            stiffness: 300,
            damping: 30,

            delay: (i) => i * 0.5,
          },
        ),
        animate(
          "[data-animate='background']",
          {
            clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
          },
          {
            type: "spring",
            stiffness: 210,
            damping: 30,
            delay: 0.65,
          },
        ),
      ]);

      await Promise.all([
        animate(
          "[data-animate='header-line']",
          {
            clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
          },
          {
            ease: "easeInOut",
            duration: 1.7,
          },
        ),
        animate(
          "[data-animate='about-char']",
          {
            x: ["-100%", "0%"],
          },
          {
            ease: "easeOut",
            duration: 0.5,
            delay: (i) => i * 0.05 + 1.2,
          },
        ),
        animate(
          "[data-animate='search-form']",
          {
            clipPath: [
              "inset(0% 100% 0% 0% round 8px)",
              "inset(0% 0% 0% 0% round 8px)",
            ],
          },
          {
            ease: "easeOut",
            delay: 1,
            duration: 0.7,
          },
        ),
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, [animate, scope, middleIndex, phase]);

  return (
    <main ref={scope} className="flex flex-col relative h-screen">
      <div
        data-animate="logo-container"
        className={styles.logoContainer}
      >
        <Logo />
        <div
          data-animate="header-line"
          className={styles.headerLine}
        />
      </div>
      <div
        className={styles.headerContainer}
        data-animate="header-container"
      >
        <Header />
      </div>
      <Wipe />
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
          <MaskText direction="up" delay={3.4} wordStagger={0.05}>
            <h1 className={styles.heroTitle}>
              Your voice matters beyond the ballot box.
            </h1>
          </MaskText>
        </div>

        <div
          data-animate="hero-child"
          className={styles.heroSubtitleContainer}
        >
          <MaskText direction="up" delay={3.7}>
            <p className={styles.heroSubtitle}>
              Elections choose who represents you, but donors and
              lobbyists don&apos;t stop working once the votes are
              counted. Hold your representatives accountable to the
              people they serve. Find and contact your reps by
              entering your ZIP code below.
            </p>{" "}
          </MaskText>
        </div>

        <div
          className={styles.searchFormContainer}
          data-animate="search-form"
        >
          <SearchForm />
        </div>
      </div>
    </main>
  );
};
