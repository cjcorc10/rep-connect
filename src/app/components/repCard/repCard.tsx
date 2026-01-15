"use client";
import Image from "next/image";
import { Rep } from "../../lib/definitions";
import { useSelectedRep } from "../selectedRepContext";
import { motion, scale } from "framer-motion";
import clsx from "clsx";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.css";

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  const { setSelectedRep } = useSelectedRep();
  const { imageUrl } = useRepImage(rep);
  const role =
    rep.type === "sen"
      ? `Senator for ${rep.state}`
      : `Representative for ${rep.state}`;
  const partyColor =
    rep.party === "Republican"
      ? "var(--accent-red)"
      : "var(--accent-blue)";
  return (
    <motion.div
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setSelectedRep(rep)}
      className={clsx(
        styles.repCardContainer,
        "relative flex flex-row cursor-pointer"
      )}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        className={styles.partyBG}
        layoutId={`${rep.bioguide_id}-partyColor`}
        style={{ backgroundColor: partyColor }}
      />
      <motion.div
        layoutId={`rep-image-${rep.bioguide_id}`}
        className={clsx(
          styles.repCardImage,
          "absolute w-full h-full"
        )}
        whileHover={{ x: 5 }}
      >
        <div className={styles.repCardImageGradient} />
        <Image
          src={imageUrl || rep.image_url || ""}
          fill
          alt={rep.full_name}
          style={{ objectFit: "cover", objectPosition: "" }}
        />
        <h3 className={styles.repCardName}>{rep.full_name}</h3>
      </motion.div>
    </motion.div>
  );
}
