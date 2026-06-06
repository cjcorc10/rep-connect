import { Accordion } from "radix-ui";
import clsx from "clsx";
import styles from "./accordion.module.scss";

export const AccordionContent = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Accordion.Content
      className={clsx(styles.accordionContent, className)}
      {...props}
    >
      {children}
    </Accordion.Content>
  );
};
