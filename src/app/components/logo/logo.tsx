import { MaskedText } from "../maskedText";
import styles from "./logo.module.scss";

type LogoProps = {
  variant?: "hero" | "header";
};

export const Logo = ({ variant = "hero" }: LogoProps) => {
  const logoText1 = "repc";
  const logoText2 = "nnect";
  return (
    <div
      className={`${styles.logo} ${variant === "header" ? styles.header : ""}`}
      data-animate="logo"
    >
      <div className={styles.logoText} data-animate="logo-text-1">
        <MaskedText text={logoText1} name="logo" />
      </div>
      <div className={styles.backgroundSlot}>
        <div className={styles.circle} data-animate="logo-circle" />

        <div
          className={styles.background}
          data-animate="logo-background"
        />
        <div
          className={styles.background}
          data-animate="logo-background-2"
        />
      </div>

      <div className={styles.logoText} data-animate="logo-text-2">
        <MaskedText text={logoText2} name="logo" />
      </div>
    </div>
  );
};
