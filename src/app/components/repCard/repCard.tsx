"use client";
import { Rep } from "../../lib/definitions";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { motion } from "framer-motion";
import RepCardBottom from "../repCardBottom/repCardBottom";
import useMeasure from "react-use-measure";
import { useRepStore } from "@/app/store/useRepStore";
import clsx from "clsx";

type RepCardProp = {
  rep: Rep;
  disabled?: boolean;
  isOpen: boolean;
};

export default function RepCard({
  rep,
  disabled,
  isOpen,
}: RepCardProp) {
  const { imageUrl } = useRepImage(rep);
  const [ref, bounds] = useMeasure();
  const { toggleRepOpen } = useRepStore();
  const height =
    isOpen && bounds.height > 0 ? bounds.height : "19rem";

  return (
    <motion.div
      layout
      animate={{ height }}
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => toggleRepOpen(rep.bioguide_id)}
      className={clsx(
        styles.repCardContainer,
        disabled && styles.disabled,
      )}
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
