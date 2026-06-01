"use client";

import clsx from "clsx";
import styles from "./govLevelTabs.module.scss";

export type GovLevel = "federal" | "state";

type Props = {
  ref: React.RefObject<HTMLDivElement | null>;
  currentLevel: GovLevel;
  onChange: (level: GovLevel) => void;
};

export default function GovLevelTabs({
  ref,
  currentLevel,
  onChange,
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
        aria-selected={currentLevel === "federal"}
        className={clsx(
          styles.tab,
          currentLevel === "federal" && styles.tabActive,
        )}
        onClick={() => {
          if (currentLevel === "federal") return;
          handleClick();
          onChange("federal");
        }}
      >
        Federal
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={currentLevel === "state"}
        className={clsx(
          styles.tab,
          currentLevel === "state" && styles.tabActive,
        )}
        onClick={() => {
          if (currentLevel === "state") return;
          handleClick();
          onChange("state");
        }}
      >
        State
      </button>
    </div>
  );
}
