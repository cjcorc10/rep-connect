"use client";
import { Rep } from "../../lib/definitions";
import { useActiveRep } from "../activeRepContext";
import clsx from "clsx";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RepCardBottom from "../repCardBottom/repCardBottom";

type RepCardProp = {
  rep: Rep;
  disabled?: boolean;
};

export default function RepCard({ rep, disabled }: RepCardProp) {
  // const { setIsOpen, activeRep } = useActiveRep();
  const { imageUrl, loading } = useRepImage(rep);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      console.log(bottomRef.current.offsetHeight);
    }
  }, [isOpen]);

  return (
    <motion.div
      layout
      animate={{
        height: isOpen ? `min(60vh, 40rem)` : "min(31vh, 20rem)",
      }}
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setIsOpen(!isOpen)}
      // onClick={() => {
      //   if (!disabled && activeRep?.bioguide_id === rep.bioguide_id)
      //     setIsOpen(true);
      // }}
      className={styles.repCardContainer}
    >
      <div className={styles.topSection}>
        <motion.div
          layoutId={`rep-image-${rep.bioguide_id}`}
          className={styles.repCardImage}
        >
          <RepImageContainer portraitSrc={imageUrl} />
        </motion.div>
        <div className={styles.repCardContent}>
          <h3 className={styles.repParty}>{rep.party}</h3>
          <h1 className={styles.repName}>{rep.full_name}</h1>
          <h3 className={styles.repDistrict}>
            {rep.state}{" "}
            {rep.type === "sen"
              ? `Senator`
              : `District ${rep.district}`}
          </h3>
        </div>
      </div>
      {isOpen && <RepCardBottom rep={rep} />}
    </motion.div>
  );
}
