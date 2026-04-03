import type { ReactNode } from "react";
import styles from "./menu.module.scss";

type MenuButtonLink = {
  variant: "link";
  href: string;
  children: ReactNode;
  color?: string;
  background?: boolean;
};

type MenuButtonPhone = {
  variant: "phone";
  phone: string;
  children: ReactNode;
  color?: string;
  background?: boolean;
};

type MenuButtonAction = {
  variant: "button";
  onClick: () => void;
  children: ReactNode;
  color?: string;
  background?: boolean;
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
  const { children, color } = props;
  const className = styles.menuButton;
  const style = color ? { backgroundColor: color } : undefined;

  switch (props.variant) {
    case "link":
      return (
        <a
          className={className}
          href={props.href}
          style={style}
          {...linkProps}
        >
          {children}
        </a>
      );
    case "phone":
      return (
        <a
          className={className}
          href={`tel:${props.phone.replace(/\D/g, "")}`}
          style={style}
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
          style={style}
        >
          {children}
        </button>
      );
  }
}
