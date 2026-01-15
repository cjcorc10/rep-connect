import { Pencil } from "lucide-react";
import styles from "./address.module.css";
import { useState, useEffect } from "react";
export default function Address({ address }: { address: string }) {
  const [value, setValue] = useState(address);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={styles.addressContainer}>
      {editing ? (
        <form>
          <input
            className={styles.addressTitle}
            data-mounted={mounted}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <button
            className={styles.submit}
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil />
          </button>
        </form>
      ) : (
        <div
          className={styles.addressDisplay}
          onClick={() => setEditing(true)}
        >
          {value}
        </div>
      )}
    </div>
  );
}
