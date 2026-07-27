"use client";
import Link from "next/link";
import styles from "./header.module.scss";
import { useRef } from "react";
import { AnimatedLogo } from "../animatedLogo/animatedLogo";
import { usePageTransition } from "@/app/store/usePageTransition";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const text = "bout";
  const navigate = usePageTransition((s) => s.navigate);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header ref={sentinelRef} className={styles.header}>
      <div className={styles.logoContainer}>
        <button
          className={styles.logoButton}
          type="button"
          aria-label="Home"
          onClick={() => {
            if (pathname === "/") return;
            navigate("/", () => router.push("/"));
          }}
        >
          <AnimatedLogo />
        </button>
      </div>

      <div className={styles.navList}>
        <Link href="/about" className={styles.navLink}>
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
