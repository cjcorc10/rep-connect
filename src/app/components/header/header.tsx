"use client";
import styles from "./header.module.scss";
import { useRef } from "react";
import { usePageTransition } from "@/app/store/usePageTransition";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo/logo";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = usePageTransition((s) => s.navigate);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header ref={sentinelRef} className={styles.header}>
      <div className={styles.navList}>
        <a
          onClick={() => navigate("/", () => router.push("/"))}
          className={styles.navLink}
        >
          {pathname !== "/" && <Logo />}
        </a>
        <a
          onClick={() =>
            navigate("/about", () => router.push("/about"))
          }
          className={styles.navLink}
        >
          <MaskedText text="About" name="about" />
        </a>
      </div>
    </header>
  );
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
