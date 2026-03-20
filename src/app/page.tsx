"use client";
import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import Hero from "./components/hero/hero";

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
    
    tl.from(
      titleRef.current,
      {
        top: '25%',
        width: '100%',
        duration: 1,
        delay: 0.5,
      },
    );
    tl.from(
      navBackColorRef.current,
      {
        transform: "translateY(-100%)",
        duration: 1,
        ease: "power3.out",
      }, ">-0.5"
    );
    tl.from(bottomSectionRef.current, {
      transform: "translateY(100%)",
      duration: 1,
      ease: "power3.out",
    }, "<")
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
      transform: "translateY(5%)"
    })

  });

  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
        <div className={styles.background}>
          <Image
            src="/images/protest.jpg"
            alt="kamran-abdullayev"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div ref={navItemsRef} className={styles.navBar}>
         <div className={styles.navList}>
            <Link
              className={styles.navLink}
              href="/"
              >
              Home
            </Link>
          </div>
          <div className={styles.navList}>
            <Link
              className={styles.navLink}
              href="/about"
              >
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
      <div ref={heroRef} className={styles.heroContainer}>
        <Hero />
      </div>
      <div ref={bottomSectionRef} className={styles.bottomSection}>
        <div className={styles.textSection}>
          <div className={styles.textContent}>
            <h2 className={styles.textHeading}>Lorem ipsum dolor sit</h2>
            <p className={styles.textBody}>Lorem ipsum dolor sit amet consectetur. Massa phasellus tellus nisl faucibus morbi nunc sed. Enim facilisis aenean eget pretium praesent. Mauris dui ac arcu.</p>
          </div>
          <div className={styles.textBackground}>
            <Image
              src="/images/text-background.svg"
              alt="text background"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div className={styles.textSection}>
          <div className={styles.textContent}>
            <h2 className={styles.textHeading}>Lorem ipsum dolor sit</h2>
            <p className={styles.textBody}>Lorem ipsum dolor sit amet consectetur. Massa phasellus tellus nisl faucibus morbi nunc sed. Enim facilisis aenean eget pretium praesent. Mauris dui ac arcu.</p>
          </div>
          <div className={styles.textBackground}>
            <Image
              src="/images/text-background.svg"
              alt="text background"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
