"use client";

import clsx from "clsx";
import styles from "./repsLevelTabs.module.scss";

export type RepsLevel = "federal" | "state";

type Props = {
  value: RepsLevel;
  onChange: (level: RepsLevel) => void;
};

/** Federal vs state map/roster: skewed folder-style tab buttons. */
export default function RepsLevelTabs({ value, onChange }: Props) {
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
        onClick={() => onChange("federal")}
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
        onClick={() => onChange("state")}
      >
        State
      </button>
    </div>
  );
}
