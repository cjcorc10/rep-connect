"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";
import { useRouter } from "next/navigation";
import { usePageTransition } from "./store/usePageTransition";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { reset, targetHref, enterLoading } = usePageTransition();
  const isExiting = targetHref !== null;
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
      <div className={styles.transitionContainer}>
        <motion.div
          initial={{ y: "100%" }}
          animate={isExiting ? { y: "-100%" } : undefined}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={styles.transitionBackground}
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={isExiting ? { y: "-100%" } : undefined}
          className={styles.transitionBackground}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: "easeInOut",
          }}
          onAnimationComplete={() => {
            if (isExiting) router.push(targetHref);
            enterLoading();
          }}
        />
      </div>
      <motion.div
        animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ delay: 0.4, duration: 0 }}
      >
        <div className={styles.background}>
          <div className={styles.backgroundOverlay} />
          <Image
            src="/images/protest.jpg"
            alt="kamran-abdullayev"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.heroContainer}>
          <div className={styles.heroTextContainer}>
            <h1 className={styles.heroTitle}>
              Your voice matters beyond the ballot box.
            </h1>
          </div>

          <div className={styles.heroSubtitleContainer}>
            <p className={styles.heroSubtitle}>
              Elections choose who represents you, but donors and
              lobbyists don&apos;t stop working once the votes are
              counted.{" "}
            </p>
            <br />
            <p className={styles.heroSubtitle}>
              Hold your representatives <b>accountable</b> to the
              people they serve, not the interests that fund their
              campaigns. Find and contact your reps by entering your
              ZIP code below.
            </p>
          </div>
          <div className={styles.searchForm}>
            <SearchForm />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
