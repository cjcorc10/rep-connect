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
  gsap.registerPlugin(SplitText);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const maskList = useRef<HTMLAnchorElement[]>([]);
  const logoRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const addToMaskList = (element: HTMLAnchorElement) => {
    if (element && !maskList.current.includes(element)) {
      maskList.current.push(element);
    }
  };

  useGSAP(() => {
    const windowSize = window.innerWidth;
    if (windowSize < 768) {
      gsap.set(containerRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        width: "100%",
        height: "100%",
      });
      gsap.set(navItemsRef.current, {
        height: "100%",
        width: "100%",
      });
      gsap.set(titleRef.current, {
        top: "2rem",
        bottom: "unset",
        width: 250,
      });
      gsap.set(heroRef.current, {
        opacity: 1,
      });
      return;
    }
    const maskText = SplitText.create(maskList.current, {
      type: "words",
      mask: "words",
    });

    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.out",
    });
    tl.from(
      maskText.words,
      {
        y: "100%",
      },
      ">"
    );
    tl.from(
      logoRef.current,
      {
        y: "110%",
      },
      "<"
    );
    tl.to(
      titleRef.current,
      {
        top: "2rem",
        bottom: "unset",
        width: 250,
        duration: 1,
      },
      ">+0.5"
    );
    tl.to(
      containerRef.current,
      {
        height: "100%",
        width: "100%",
        ease: "power3.out",
      },
      "<"
    );
    tl.to(
      navItemsRef.current,
      {
        height: "100%",
        width: "100%",
        ease: "power3.out",
      },
      "<"
    );
    tl.to(
      heroRef.current,
      {
        opacity: 1,
      },
      ">+0.5"
    );
  });

  return (
    <main className="flex flex-col flex-1 min-h-0 relative">
      {/* <div className="absolute right-[-6%]">
        <JumpingImage />
      </div> */}
      <div className={styles.navContainer}>
        <div className={styles.navBackground}>
          <Image
            src="/images/kamran-abdullayev.jpg"
            alt="kamran-abdullayev"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div ref={containerRef} className={styles.navBackdrop}>
        <div ref={navItemsRef} className={styles.navItems}>
          <div className={styles.navList}>
            <Link
              ref={addToMaskList}
              className={styles.navLink}
              href="/"
            >
              Home
            </Link>
          </div>
          <div className={styles.navList}>
            <Link
              ref={addToMaskList}
              className={styles.navLink}
              href="/about"
            >
              About
            </Link>
          </div>

          <div ref={titleRef} className={styles.logo}>
            <Image
              ref={logoRef}
              src="/images/REPCONNECT (1).svg"
              alt="repconnect logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
      <div ref={heroRef} className={styles.heroContainer}>
        <Hero />
      </div>
    </main>
  );
}
