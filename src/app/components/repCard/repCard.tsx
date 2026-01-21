"use client";
import Image from "next/image";
import { Rep } from "../../lib/definitions";
import { useSelectedRep } from "../selectedRepContext";
import { motion, scale } from "framer-motion";
import clsx from "clsx";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.css";
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
      whileTap={{ scale: 0.98 }}
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
        <RepImageContainer portraitSrc={imageUrl} />
        <motion.h3 layoutId={`rep-name-${rep.bioguide_id}`} className="text-white text-3xl font-bold absolute bottom-5 w-full text-center z-2">{rep.full_name}</motion.h3>
        </motion.div>
    </motion.div>
  );
}
