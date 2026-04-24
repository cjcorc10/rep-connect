"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import SearchForm from "./components/searchForm/searchForm";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
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
        <h1 className={styles.heroTitle}>
          Get loud, contact your representatives today.
        </h1>
        <p className={styles.heroSubtitle}>
          Candidates run on a promise to represent their constituents.
          Don&apos;t let them forget that promise once they get into
          office. Call them today and pressure them to vote for your
          community&apos;s interests.
        </p>
        <div className={styles.searchForm}>
          <SearchForm />
        </div>
      </div>
    </main>
  );
}
