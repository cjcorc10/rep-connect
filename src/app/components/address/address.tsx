import styles from "./address.module.css";
import { useState, useEffect } from "react";
export default function Address({ address }: { address: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={styles.addressContainer}>
      <form>
        <input className={styles.addressTitle} data-mounted={mounted} value={address}
          onChange={(e) => address =  e.currentTarget.value}/>
      </form>
    </div>
  );
}
