"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SearchForm from "../searchForm";
import styles from "./hero.module.css";
import { motion, useSpring, useMotionTemplate } from "framer-motion";

export default function Hero() {
  const heroTitle =
    "Make your voice heard, contact your representatives ";
  const heroLast = "Today.";

  const [ready, setReady] = useState(false);
  const clipValue = useSpring(0, {
    stiffness: 80,
    damping: 16,
    mass: 1,
  });
  const clipPath = useMotionTemplate`inset(0% ${clipValue}% 0% 0%)`;
  useEffect(() => {
    if (ready) {
      clipValue.set(100);
    }
  });

  return (
    <motion.section
      className={styles.container}
      style={{
        clipPath,
      }}
    >
      <motion.div className={styles.imageWrap}>
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
      </motion.div>

      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            {heroTitle}
            <span className={styles.last}>{heroLast}</span>
          </h2>
        </header>

        <div
          className={styles.formWrapper}
          aria-label="Find your representatives by location"
        >
          <SearchForm setReady={() => setReady(true)} />
        </div>
      </div>
    </motion.section>
  );
}
