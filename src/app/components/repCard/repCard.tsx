"use client";
import { Rep } from "../../lib/definitions";
import { useSelectedRep } from "../selectedRepContext";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  const { setSelectedRep } = useSelectedRep();
  const { imageUrl } = useRepImage(rep);
  return (
    <motion.div
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setSelectedRep(rep)}
      className={clsx(
        styles.repCardContainer,
        "relative flex flex-row cursor-pointer shadow-lg"
      )}
      initial={{ opacity: 0, y: 10, scale: 0.95}}
      animate={{opacity: 1, y: 0, scale: 1, }}
      whileTap={{ y: 0.5 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        layoutId={`rep-image-${rep.bioguide_id}`}
        className={clsx(
          styles.repCardImage,
          "absolute w-full h-full"
        )}

        >
          {imageUrl ? (

            <RepImageContainer portraitSrc={imageUrl} />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        <motion.h3 layoutId={`rep-name-${rep.bioguide_id}`} className={styles.repName}>{rep.full_name}</motion.h3>
        </motion.div>
    </motion.div>
  );
}
