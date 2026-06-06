"use client";
import styles from "./island.module.scss";
import { RefObject, useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function Island({
  sentinelRef,
}: {
  sentinelRef: RefObject<HTMLDivElement>;
}) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      {
        root: null,
        threshold: 0,
        rootMargin: "0px",
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [sentinelRef]);

  return (
    <div
      key="island"
      className={styles.island}
      data-visible={pastHero}
    >
      <Menu size={48} className={styles.menuIcon} />
    </div>
  );
}
