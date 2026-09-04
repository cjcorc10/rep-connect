"use client";
import styles from "./header.module.scss";
import { usePageTransition } from "@/app/store/usePageTransition";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo2 } from "../logo/logo2";

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
  const isHome = pathname === "/";

  const content = (
    <>
      {!isHome && (
        <a
          className={styles.homeLink}
          onClick={() => navigate("/", () => router.push("/"))}
        >
          <Logo2 variant="header" />
        </a>
      )}

      <a
        onClick={() =>
          navigate("/about", () => router.push("/about"))
        }
        className={styles.navLink}
      >
        About
      </a>
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
