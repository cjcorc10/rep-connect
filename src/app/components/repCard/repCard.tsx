"use client";
import { Rep } from "../../lib/definitions";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { motion, MotionConfig } from "framer-motion";
import { useState } from "react";
import RepCardBottom from "../repCardBottom/repCardBottom";
import useMeasure from "react-use-measure";

type RepCardProp = {
  rep: Rep;
  disabled?: boolean;
};

export default function RepCard({ rep, disabled }: RepCardProp) {
  const { imageUrl } = useRepImage(rep);
  const [isOpen, setIsOpen] = useState(false);
  const [ref, bounds] = useMeasure();

  const height =
    isOpen && bounds.height > 0 ? bounds.height : "min(31vh, 20rem)";

  return (
    <motion.div
      layout
      animate={{ height }}
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setIsOpen(!isOpen)}
      // onClick={() => {
      //   if (!disabled && activeRep?.bioguide_id === rep.bioguide_id)
      //     setIsOpen(true);
      // }}
      className={styles.repCardContainer}
    >
      <div ref={ref} className={styles.contentWrapper}>
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
      </div>
    </motion.div>
  );
}
