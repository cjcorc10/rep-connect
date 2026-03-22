import styles from "./beautifulButton.module.scss";

export const BeautifulButton = ({ content }: { content: string }) => {
  return (
    <button className={styles.button}>
      <span className={styles.shadow} />
      <span className={styles.edge} />
      <span className={styles.top}>{content}</span>
    </button>
  );
};
