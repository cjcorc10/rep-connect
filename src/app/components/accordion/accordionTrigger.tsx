import clsx from "clsx";
import { Accordion } from "radix-ui";
import styles from "./accordion.module.scss";

export const AccordionTrigger = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}) => {
  return (
    <Accordion.Trigger
      className={clsx(styles.accordionTrigger, className)}
      {...props}
    >
      {children}
    </Accordion.Trigger>
  );
};
