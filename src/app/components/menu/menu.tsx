import { useSelectedRep } from "../selectedRepContext";
import styles from "./menu.module.scss";
import { useState, useEffect } from "react";

export default function Menu() {
  const { selectedRep } = useSelectedRep();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className={styles.menu} data-mounted={isMounted}>
      <div className={styles.menuButtons}>
        <button className={styles.menuButton}>call</button>
        <button className={styles.menuButton}>tweet</button>
        <button className={styles.menuButton}>view donations</button>
        <button className={styles.menuButton}>view voting</button>
        <button className={styles.menuButton}>view details</button>
      </div>
    </div>
  );
}
