"use client";
import { Rep } from "../../lib/definitions";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { useRepStore } from "@/app/store/useRepStore";
import clsx from "clsx";

type RepCardProp = {
  rep: Rep;
  disabled?: boolean;
};

export default function RepCard({ rep, disabled }: RepCardProp) {
  const { imageUrl } = useRepImage(rep);
  const { toggleRepDetail } = useRepStore();

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && toggleRepDetail(rep.bioguide_id)}
      onKeyDown={(e) => {
        if (
          !disabled &&
          (e.key === "Enter" || e.key === " ")
        ) {
          e.preventDefault();
          toggleRepDetail(rep.bioguide_id);
        }
      }}
      className={clsx(
        styles.repCardContainer,
        disabled && styles.disabled,
      )}
    >
      <div className={styles.repCardImage}>
        <RepImageContainer portraitSrc={imageUrl} />
      </div>
    </div>
  );
}
