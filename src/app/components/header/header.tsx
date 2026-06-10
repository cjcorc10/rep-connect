"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import { useRef } from "react";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  return (
    <header ref={sentinelRef} className={styles.header}>
      <div className={styles.navList}>
        <Link className={styles.navLink} href="/">
          Home
        </Link>
      </div>
      <div className={styles.navList}>
        <Link className={styles.navLink} href="/about">
          About
        </Link>
      </div>
      <Link href="/" className={styles.logo}>
        REPCONNECT
      </Link>
    </header>
  );
}
