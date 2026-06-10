import clsx from "clsx";
import styles from "./beautifulButton.module.scss";

type BeautifulButtonProps = {
  content: string;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export const BeautifulButton = ({
  content,
  className,
  type = "submit",
}: BeautifulButtonProps) => {
  return (
    <button type={type} className={clsx(styles.button, className)}>
      <span className={styles.shadow} />
      <span className={styles.edge} />
      <span className={styles.top}>{content}</span>
    </button>
  );
};
