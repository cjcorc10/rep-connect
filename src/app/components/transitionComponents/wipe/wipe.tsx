import styles from "./wipe.module.scss";
export const Wipe = () => {
  return (
    <>
      <div className={styles.wipe1} data-animate="background-wipe" />
      <div className={styles.wipe2} data-animate="background-wipe" />
    </>
  );
};
