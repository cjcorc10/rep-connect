"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import Island from "../island/island";
import { RefObject, useRef } from "react";

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
      {/* <Island
        sentinelRef={sentinelRef as RefObject<HTMLDivElement>}
      /> */}
      {/* <Link href="/" className={styles.logo}>
        <Image
          // src="/images/REPCONNECT (1).svg"
          src="/images/logo.svg"
          alt="Repconnect logo"
          fill
          style={{ objectFit: "contain" }}
        />
      </Link> */}
    </header>
  );
}
