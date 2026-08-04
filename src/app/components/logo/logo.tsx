import { MaskedText } from "../maskedText";
import styles from "./logo.module.scss";
export const Logo = () => {
  const logoText1 = "repc";
  const logoText2 = "nnect";
  return (
    <div className={styles.logo} data-animate="logo">
      <div className={styles.logoText}>
        <MaskedText text={logoText1} name="logo" />
      </div>
      <div className={styles.logoText}>
        <MaskedText text={logoText2} name="logo" />
      </div>
      <div className={styles.circle} data-animate="logo-circle" />
    </div>
  );
};
