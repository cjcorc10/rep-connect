import clsx from "clsx";
import styles from "./beautifulButton.module.scss";

type BeautifulButtonProps = {
  content: string;
  /** Smaller control for tight layouts (e.g. inside a search field). */
  compact?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export const BeautifulButton = ({
  content,
  compact = false,
  className,
  type = "submit",
}: BeautifulButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, compact && styles.compact, className)}
    >
      <span className={styles.shadow} />
      <span className={styles.edge} />
      <span className={styles.top}>{content}</span>
    </button>
  );
};
