import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.navList}>
        <Link className={styles.navLink} href="/">
          Home
        </Link>
      </div>
      <div className={styles.navList}>
        <Link className={styles.navLink} href="/about">
          About
        </Link>
      </div>
      <Link href="/" className={styles.logo}>
        <Image
          // src="/images/REPCONNECT (1).svg"
          src="/images/logo.svg"
          alt="Repconnect logo"
          fill
          style={{ objectFit: "contain" }}
        />
      </Link>
    </header>
  );
}
