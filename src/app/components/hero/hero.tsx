"use client";

import SearchForm from "../searchForm";
import styles from "./hero.module.css";

export default function Hero() {
  const heroTitle =
    "Make your voice heard, contact your representatives Today";

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>{heroTitle}</h2>
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
