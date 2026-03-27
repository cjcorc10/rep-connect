import styles from "./beautifulButton.module.scss";

type BeautifulButtonProps = {
  content: string;
  as?: "button" | "span";
  type?: "button" | "submit" | "reset";
};

export const BeautifulButton = ({
  content,
  as = "button",
  type = "submit",
}: BeautifulButtonProps) => {
  if (as === "span") {
    return (
      <span className={styles.button}>
        <span className={styles.shadow} />
        <span className={styles.edge} />
        <span className={styles.top}>{content}</span>
      </span>
    );
  }

  return (
    <button type={type} className={styles.button}>
      <span className={styles.shadow} />
      <span className={styles.edge} />
      <span className={styles.top}>{content}</span>
    </button>
  );
};
