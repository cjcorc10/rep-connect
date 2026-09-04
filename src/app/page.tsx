"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";
import { useAnimate } from "framer-motion";
import { usePageEntrance } from "./hooks/usePageEntrance";
import { useEffect } from "react";
import { Wipe } from "./components/transitionComponents/wipe/wipe";
import Header from "./components/header/header";
import { type Phase } from "./store/usePageTransition";
import { Logo2 } from "./components/logo/logo2";

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
  const pullBackTransition = {
    type: "spring",
    stiffness: 75,
    damping: 15,
  };
  const pullBackTransition2 = {
    ease: "easeOut",
    duration: 1.2,
  };
  const releaseTransition = {
    type: "spring",
    stiffness: 500,
    damping: 20,
  };

  useEffect(() => {
    if (phase !== "idle") return;
    let cancelled = false;

    (async () => {
      await Promise.all([
        animate(
          "[data-animate='logo-char-container']",
          {
            y: "150%",
          },
          {
            duration: 0,
          },
        ),
        animate(
          "[data-animate='hero-container']",
          {
            y: "100%",
            flex: "0 0 0",
          },
          {
            duration: 0,
          },
        ),
        animate(
          "[data-animate='background']",
          {
            flex: "1 1 100%",
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
          "[data-animate='logo-background'] ",
          {
            clipPath: ["inset(50% 50% 50% 50%)", "inset(46% 43%)"],
          },
          {
            delay: 0.55,
            ...pullBackTransition,
          },
        ),
        animate(
          "[data-animate='logo-text-1']",
          {
            x: "-0.75em",
          },
          {
            delay: 0.4,
            ...pullBackTransition,
          },
        ),
        animate(
          "[data-animate='logo-text-2']",
          {
            x: "0.75em",
          },
          {
            delay: 0.4,
            ...pullBackTransition,
          },
        ),
      ]);
      await Promise.all([
        animate(
          "[data-animate='logo-text-1']",
          {
            x: "-0.4em",
          },
          {
            ...pullBackTransition2,
          },
        ),
        animate(
          "[data-animate='logo-text-2']",
          {
            x: "0.4em",
          },
          {
            ...pullBackTransition2,
          },
        ),
        animate(
          "[data-animate='logo-background']",
          {
            clipPath: "inset(43% 43%)",
          },
          {
            delay: 0.1,
            ...pullBackTransition2,
          },
        ),
      ]);
      await Promise.all([
        animate(
          "[data-animate='logo-text-1']",
          {
            x: "0em",
          },
          {
            ...releaseTransition,
          },
        ),
        animate(
          "[data-animate='logo-text-2']",
          {
            x: "0em",
          },
          {
            ...releaseTransition,
          },
        ),
        animate(
          "[data-animate='logo-background']",
          {
            clipPath: "inset(0% 0%)",
          },
          {
            ...releaseTransition,
          },
        ),
        animate(
          "[data-animate='logo-text-container']",
          {
            scale: 0.75,
          },
          {
            ...releaseTransition,
          },
        ),
      ]);

      await Promise.all([
        animate(
          "[data-animate='logo']",
          {
            scale: 0.5,
            // x: "25%",
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
          "[data-animate='header-container']",
          {
            transform: ["translateX(100%)", "translateX(0%)"],
          },
          {
            ease: "easeOut",
            duration: 1.2,
          },
        ),
        animate(
          "[data-animate='background-image']",
          {
            scale: 1,
            filter: "blur(2px)",
          },
          {
            ease: "easeOut",
            duration: 1.2,
          },
        ),
        animate(
          "[data-animate='background']",
          {
            y: "-25%",
          },
          {
            ease: "easeOut",
            duration: 1.2,
          },
        ),
        animate(
          "[data-animate='hero-container']",
          {
            flex: "0 0 50%",
            y: "0%",
          },
          {
            ease: "easeOut",
            duration: 1.2,
          },
        ),
        animate(
          "[data-animate='logo-container']",
          {
            left: "-50%",
          },
          {
            ease: "easeOut",
            duration: 0.8,
            delay: 0.4,
          },
        ),
        animate(
          "[data-animate='logo']",
          {
            x: "25%",
          },
          {
            ease: "easeOut",
            duration: 0.8,
            delay: 0.4,
          },
        ),
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, [animate, scope, middleIndex, phase]);

  return (
    <main ref={scope} className="flex flex-col relative min-h-screen">
      <div
        data-animate="logo-container"
        className={styles.logoContainer}
      >
        <Logo2 variant="hero" />
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
          data-animate="background-image"
          src="/images/unseen-histories.jpg"
          alt="kamran-abdullayev"
          fill
          style={{
            objectFit: "cover",
            transform: "scale(2)",
            transformOrigin: "top left",
            filter: "blur(10px)",
          }}
        />
      </div>
      <div className={styles.pageContent}>
        <div className={styles.spacer} />
        <div
          className={styles.heroContainer}
          data-animate="hero-container"
        >
          <div className={styles.heroContent}>
            <div
              data-animate="hero-child"
              className={styles.heroTextContainer}
            >
              <h1 className={styles.heroTitle}>
                Your voice matters beyond the ballot box.
              </h1>
            </div>
            <div
              className={styles.searchFormContainer}
              data-animate="search-form"
            >
              <SearchForm />
            </div>
            <div
              data-animate="hero-child"
              className={styles.heroSubtitleContainer}
            >
              <p className={styles.heroSubtitle}>
                Find and contact your elected officials by entering
                your ZIP code.
              </p>{" "}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
