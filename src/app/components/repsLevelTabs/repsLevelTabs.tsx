"use client";

import clsx from "clsx";
import styles from "./repsLevelTabs.module.scss";

export type RepsLevel = "federal" | "state";

type Props = {
  value: RepsLevel;
  onChange: (level: RepsLevel) => void;
  ref: React.RefObject<HTMLDivElement | null>;
};

export default function RepsLevelTabs({
  value,
  onChange,
  ref,
}: Props) {
  const handleClick = () => {
    if (!ref.current) return;
    const target = ref.current;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
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
          handleClick();
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
          handleClick();
          onChange("state");
        }}
      >
        State
      </button>
    </div>
  );
}
