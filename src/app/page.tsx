"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";
import { motion, type Variants } from "framer-motion";
import Header from "./components/header/header";
import { usePageEntrance } from "./hooks/usePageEntrance";
import { useEffect } from "react";

export default function Home() {
  const { isDestination, revealComplete, phase, transitionId } =
    usePageEntrance();

  useEffect(() => {
    if (isDestination) revealComplete();
  }, [isDestination, revealComplete]);

  const coverVariants: Variants = {
    initial: { height: "0vh", width: "0vw" },
    animate: {
      height: ["0vh", "25vh", "25vh", "100vh"],
      width: ["0vw", "25vw", "25vw", "100vw"],
      transition: {
        duration: 2.5,
        delay: 0.5,
        ease: ["backOut", "easeOut", "easeOut"],
        times: [0, 0.25, 0.75, 1],
      },
    },
  };

  const headerVariants = {
    initial: { y: "-100%" },
    animate: {
      y: "0%",
      transition: {
        ease: "backOut" as const,
        duration: 0.5,
        delay: 1.5,
      },
    },
  };

  const heroContainerVariants = {
    animate: {
      transition: {
        delayChildren: 3.25,
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUpVariants = {
    initial: { opacity: 0, y: "5%" },
    animate: {
      opacity: 1,
      y: "0%",
      transition: {
        ease: "easeOut" as const,
        duration: 0.5,
      },
    },
  };

  const animateState =
    phase === "idle" || phase === "covering" ? "animate" : "initial";

  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
      <motion.div
        key={`cover-${transitionId}`}
        variants={coverVariants}
        initial="initial"
        animate={animateState}
        className={styles.backgroundReveal}
      >
        <motion.div
          className={styles.headerContainer}
          variants={headerVariants}
          initial="initial"
          animate={animateState}
        >
          <Header />
        </motion.div>
        <div className={styles.background} data-animate="background">
          <div className={styles.backgroundOverlay} />
          <Image
            src="/images/protest.jpg"
            alt="kamran-abdullayev"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </motion.div>
      <motion.div
        key={`hero-${transitionId}`}
        className={styles.heroContainer}
        variants={heroContainerVariants}
        initial="initial"
        animate={animateState}
      >
        <motion.div
          className={styles.heroTextContainer}
          variants={fadeUpVariants}
        >
          <h1 className={styles.heroTitle}>
            Your voice matters beyond the ballot box.
          </h1>
        </motion.div>

        <motion.div
          className={styles.heroSubtitleContainer}
          variants={fadeUpVariants}
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
        </motion.div>
        <motion.div
          className={styles.searchForm}
          variants={fadeUpVariants}
        >
          <SearchForm />
        </motion.div>
      </motion.div>
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
