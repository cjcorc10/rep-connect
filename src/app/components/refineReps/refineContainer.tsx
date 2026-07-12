import { motion } from "framer-motion";
import styles from "./refine.module.scss";

export const RefineContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </motion.div>
  );
};
