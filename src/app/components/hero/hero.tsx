"use client";

import SearchForm from "../searchForm";
import styles from "./hero.module.css";

export default function Hero() {
  const heroTitle =
    "Make your voice heard, contact your representatives Today";


  return (
    <section
      className={styles.container}

    >
      {/* <motion.div className={styles.imageWrap}>
        <Image
          src="/images/kamran-abdullayev.jpg"
          alt="voting image"
          aria-hidden="true"
          fill
          priority
          className={styles.cover}
          sizes="(max-width: 1024px) 92vw, 1000px"
        />
        <div className={styles.overlay} />
      </motion.div> */}

      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {heroTitle}
          </h2>
        </header>

        <div
          className={styles.formWrapper}
          aria-label="Find your representatives by location"
        >
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
