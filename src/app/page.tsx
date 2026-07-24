"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
      <div>
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
      </div>
    </main>
  );
}
