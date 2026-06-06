"use client";

import { useEffect, useRef } from "react";
import styles from "./govLevelTabs.module.scss";
import clsx from "clsx";

export type GovLevel = "federal" | "state";
type Props = {
  currentLevel: GovLevel;
  onChange: (level: GovLevel) => void;
};

const TABS = ["federal", "state"];

export default function GovLevelTabs({
  currentLevel,
  onChange,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const selectedTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !selectedTabRef.current) return;

    const { offsetWidth } = sectionRef.current;
    const left = selectedTabRef.current.offsetLeft;
    const right = selectedTabRef.current.offsetWidth + left;
    sectionRef.current.style.clipPath = `inset(0% ${Number(100 - (right / offsetWidth) * 100).toFixed(2)}% 0% ${Number((left / offsetWidth) * 100).toFixed(2)}% round 50px)`;
    console.log(right);
  }, [selectedTabRef, currentLevel]);

  return (
    <div className={styles.tabSelector}>
      <div className={styles.list}>
        {TABS.map((tab) => (
          <div
            onClick={() => onChange(tab as GovLevel)}
            ref={tab === currentLevel ? selectedTabRef : null}
            key={tab}
            className={styles.tab}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className={styles.clipPathOverlay} ref={sectionRef}>
        <div className={clsx(styles.list, styles.overlay)}>
          {TABS.map((tab) => (
            <div
              onClick={() => onChange(tab as GovLevel)}
              key={tab}
              className={styles.tab}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
