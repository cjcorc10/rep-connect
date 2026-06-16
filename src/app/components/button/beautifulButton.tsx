import clsx from "clsx";
import styles from "./beautifulButton.module.scss";
import { motion } from "framer-motion";

type BeautifulButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  formId?: string;
  onClick?: () => void;
};

export const BeautifulButton = ({
  children,
  className,
  type = "submit",
  formId,
  onClick,
}: BeautifulButtonProps) => {
  return (
    <button
      type={type}
      form={formId}
      className={clsx(styles.button, className)}
      onClick={onClick}
    >
      <span className={styles.shadow} />
      <span className={styles.edge} />
      <motion.span className={styles.top}>{children}</motion.span>
    </button>
  );
};
