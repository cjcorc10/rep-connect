"use client";

import Image from "next/image";
import SearchForm from "../searchForm";
import styles from "./hero.module.css";
import {motion, useSpring, useMotionTemplate} from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const heroTitle =
    "Make your voice heard, contact your representatives ";
  const heroLast = "Today.";
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const x = useSpring(0, {damping: 15})
  const backgroundMask = useMotionTemplate`inset(0 ${x}% 0 0)`
  const onPointerLeave = () => {
    if(timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      x.set(0);
    }, 2000);
  }
  const onPointerEnter = () => {
    if(timeoutId.current) clearTimeout(timeoutId.current);
  }

  return (
    <section
    onPointerLeave={onPointerLeave}
    onPointerEnter={onPointerEnter}
    onPointerMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const diffX = Math.max(rect.right - e.clientX, 0)
      const percentX = Math.min((diffX / rect.width) * 100, 100)
      x.set(percentX)
    }}
      className={`${styles.container}
            relative w-full overflow-hidden shadow-2xl
            sm:rounded-3xl sm:max-w-[min(1000px,92vw)]
            sm:h-[clamp(22rem,48vh,34rem)]
          `}
    >
      <motion.div className="hidden sm:block absolute inset-0"
        style={{clipPath: backgroundMask}}
      >
        <Image
          src="/images/kamran-abdullayev.jpg"
          alt="voting image"
          aria-hidden="true"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 92vw, 1000px"
        />
        <div className="absolute inset-0 bg-black/35" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8">
        <header className="text-center">
          <h2 className={styles.title}>
            {heroTitle}
            <span className={styles.last}>
              {heroLast.split("").map((char, i) => (
                <span
                  key={i}
                  className={styles.char}
                  style={{ "--index": i } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </h2>
        </header>

        <div
          className="mt-4 w-full max-w-[720px]"
          aria-label="Find your representatives by location"
        >
          <div>
            <SearchForm />
          </div>
        </div>
      </div>
    </section>
  );
}
