import clsx from "clsx";
import { Accordion } from "radix-ui";
import styles from "./accordion.module.scss";

export const AccordionTrigger = ({
  children,
  className,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <Accordion.Trigger
      className={clsx(styles.accordionTrigger, className)}
      {...props}
      onClick={onClick}
    >
      {children}
    </Accordion.Trigger>
  );
};
