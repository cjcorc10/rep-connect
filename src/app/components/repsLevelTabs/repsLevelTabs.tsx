"use client";

import clsx from "clsx";
import styles from "./repsLevelTabs.module.scss";
import { useLenis } from "lenis/react";

export type RepsLevel = "federal" | "state";

type Props = {
  value: RepsLevel;
  onChange: (level: RepsLevel) => void;
};

export default function RepsLevelTabs({ value, onChange }: Props) {
  const lenis = useLenis();
  const scrollToTop = () => {
    lenis?.scrollTo(0, { duration: 1.2 });
  };
  return (
    <div
      className={styles.tabList}
      role="tablist"
      aria-label="Representative level"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === "federal"}
        className={clsx(
          styles.tab,
          value === "federal" && styles.tabActive,
        )}
        onClick={() => {
          if (value === "federal") return;
          scrollToTop();
          onChange("federal");
        }}
      >
        Federal
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === "state"}
        className={clsx(
          styles.tab,
          value === "state" && styles.tabActive,
        )}
        onClick={() => {
          if (value === "state") return;
          scrollToTop();
          onChange("state");
        }}
      >
        State
      </button>
    </div>
  );
}
