import type { ReactNode } from "react";
import styles from "./menu.module.scss";

type MenuButtonLink = {
  variant: "link";
  href: string;
  children: ReactNode;
};

type MenuButtonPhone = {
  variant: "phone";
  phone: string;
  children: ReactNode;
};

type MenuButtonAction = {
  variant: "button";
  onClick: () => void;
  children: ReactNode;
};

export type MenuButtonProps =
  | MenuButtonLink
  | MenuButtonPhone
  | MenuButtonAction;

const linkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export default function MenuButton(props: MenuButtonProps) {
  const { children } = props;
  const className = styles.menuButton;

  switch (props.variant) {
    case "link":
      return (
        <a className={className} href={props.href} {...linkProps}>
          {children}
        </a>
      );
    case "phone":
      return (
        <a
          className={className}
          href={`tel:${props.phone.replace(/\D/g, "")}`}
        >
          {children}
        </a>
      );
    case "button":
      return (
        <button
          type="button"
          className={className}
          onClick={props.onClick}
        >
          {children}
        </button>
      );
  }
}
