'use client';
import styles from './refineContainer.module.scss';
import { motion } from 'framer-motion';

export default function RefineContainer({ children }: { children: React.ReactNode }) {

  return (
    <motion.div className={styles.container}>
        <div className={styles.content}>
          {children}
        </div>
    </motion.div>
  );
}
