import { Pencil, PencilIcon } from "lucide-react";
import styles from "./address.module.css";
import { useState, useEffect } from "react";
export default function Address({ address }: { address: string }) {
  const [value, setValue] = useState(address);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={styles.addressContainer}>
      <form>
        <input className={styles.addressTitle} data-mounted={mounted} value={value}
          onChange={(e) => setValue(e.currentTarget.value)}/>
        <button className={styles.submit} onClick={(e) => e.stopPropagation()}><Pencil /></button>
      </form>
    </div>
  );
}