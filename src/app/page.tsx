"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Hero from "./components/hero/hero";
import SearchForm from "./components/searchForm/searchForm";

export default function Home() {
  gsap.registerPlugin(useGSAP);
  const titleRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navBackColorRef = useRef<HTMLDivElement>(null);
  const bottomSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      top: "25%",
      width: "100%",
      duration: 1,
      delay: 0.5,
    });
    tl.from(
      navBackColorRef.current,
      {
        transform: "translateY(-100%)",
        duration: 1,
        ease: "power3.out",
      },
      ">-0.5",
    );
    tl.from(
      bottomSectionRef.current,
      {
        transform: "translateY(100%)",
        duration: 1,
        ease: "power3.out",
      },
      "<",
    );
    tl.from(
      navItemsRef.current,
      {
        transform: "translateY(-100%)",
        duration: 1,
        ease: "power3.out",
      },
      "<",
    );
    tl.from(heroRef.current, {
      opacity: 0,
      transform: "translateY(5%)",
    });
  });

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
      <div ref={navItemsRef} className={styles.navBar}>
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
      </div>
      <div ref={titleRef} className={styles.logo}>
        <Image
          ref={logoRef}
          src="/images/logo.svg"
          alt="repconnect logo"
          fill
          style={{ objectFit: "contain" }}
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
      {/* <div ref={heroRef} className={styles.heroContainer}>
        <Hero />
      </div> */}
      {/* <div ref={bottomSectionRef} className={styles.bottomSection}>
        <div className={styles.textSection}>
          <div className={styles.textContent}>
            <h2 className={styles.textHeading}>
              Demand accountability
            </h2>
            <p className={styles.textBody}>
              Politicians depend on voter support to get elected and
              re-elected. By calling them, you increase the{" "}
              <b>pressure</b> that they feel when voting on
              legislation.
            </p>
          </div>
          <div className={styles.textBackground} />
        </div>
        <div className={styles.textSection}>
          <div className={styles.textContent}>
            <h2 className={styles.textHeading}>
              Who&apos;s interests are they representing?
            </h2>
            <p className={styles.textBody}>
              We provide sources to inform you about who your
              representatives accepted donations from and what they
              are voting for.
            </p>
          </div>
          <div className={styles.textBackground} />
        </div>
      </div> */}
    </main>
  );
}
