"use client";
import styles from "./header.module.scss";
import { usePageTransition } from "@/app/store/usePageTransition";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "../logo/logo";

const fadeupVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};

type HeaderProps = {
  entrance?: "shuffle" | "fade";
};

export default function Header({
  entrance = "shuffle",
}: HeaderProps) {
  const navigate = usePageTransition((s) => s.navigate);
  const router = useRouter();
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isHome = pathname === "/";
  const linkClass = `${styles.navLink} ${isHome ? styles.navLinkOnDark : styles.navLinkOnLight}`;

  const content = (
    <>
      {!isHome && (
        <a
          className={styles.homeLink}
          onClick={() => navigate("/", () => router.push("/"))}
        >
          <Logo variant="header" />
        </a>
      )}
      {isAbout ? (
        <span
          className={`${linkClass} ${styles.navLinkCurrent}`}
          aria-current="page"
        >
          <MaskedText text="About" name="about" />
        </span>
      ) : (
        <a
          onClick={() =>
            navigate("/about", () => router.push("/about"))
          }
          className={linkClass}
        >
          <MaskedText text="About" name="about" />
        </a>
      )}
    </>
  );

  if (entrance === "fade") {
    return (
      <motion.header
        className={styles.header}
        variants={fadeupVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {content}
      </motion.header>
    );
  }

  return <header className={styles.header}>{content}</header>;
}

const MaskedText = ({
  text,
  name,
}: {
  text: string;
  name: string;
}) => {
  return (
    <div
      style={{ overflow: "hidden" }}
      data-animate={`${name}-container`}
    >
      {text.split("").map((char: string, index: number) => (
        <span
          style={{
            display: "inline-block",
            width: "fit-content",
            overflow: "hidden",
          }}
          key={index}
        >
          <span
            style={{ display: "inline-block" }}
            data-animate={`${name}-char`}
          >
            {char}
          </span>
        </span>
      ))}
    </div>
  );
};

const AboutLogo = () => {
  const text1 = "ab";
  const text2 = "ut";
  return (
    <div className={styles.aboutLogo}>
      <span className={styles.aboutLogoText1}>{text1}</span>
      <div className={styles.aboutLogoDot} />
      <span className={styles.aboutLogoText2}>{text2}</span>
    </div>
  );
};
