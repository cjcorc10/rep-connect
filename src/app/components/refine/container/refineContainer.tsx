'use client';
import styles from './refineContainer.module.scss';

export default function RefineContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>
    </div>
  );
}
