"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import { useRef } from "react";
import { Logo } from "../logo/logo";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const text = "bout";
  return (
    <header ref={sentinelRef} className={styles.header}>
      <Link href="/">
        <div className={styles.logoContainer}>
          <Logo />
        </div>
      </Link>

      <div className={styles.navList}>
        <Link className={styles.navLink} href="/about">
          <div className={styles.navLinkIcon}>
            <Icon />
          </div>
          <p className={styles.navLinkText}>{text}</p>
        </Link>
      </div>
    </header>
  );
}

export const Icon = () => {
  return (
    <svg viewBox="0 0 50 50" fill="none">
      <path
        d="M 40 24 v 18.5"
        stroke="var(--blue-accent)"
        strokeWidth="5"
      />
      <circle
        cx="25"
        cy="25"
        r="15"
        stroke="var(--blue-accent)"
        strokeWidth="5"
        pathLength="100"
        strokeDasharray="85 15"
        strokeDashoffset="-15"
      />
    </svg>
  );
};
