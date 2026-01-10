"use client";
import Image from "next/image";
import styles from "./jumpinImage.module.css";

export default function JumpingImage() {
  return (
    <Image
      src="/images/chloe.svg"
      alt="chloe logo"
      width={100}
      height={100}
      className={`w-100 h-200 rotate-[-40deg] z-10 hidden xl:block ${styles.image}`}
    ></Image>
  );
}
