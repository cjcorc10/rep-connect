import styles from './address.module.css'
import { useState, useEffect } from 'react';
export default function Address({ address }: { address: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className={styles.addressContainer}>
        <h1 className={styles.addressTitle}
          data-mounted={mounted}
        >
          {address}
        </h1>
    </div>
  );
}
