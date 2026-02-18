"use client";
import { Rep } from "../../lib/definitions";
import { useActiveRep } from "../activeRepContext";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRepImage } from "./useRepImage";
import styles from "./repCard.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { Skeleton } from "@/components/ui/skeleton";

type RepCardProp = {
  rep: Rep;
  disabled?: boolean;
};

export default function RepCard({ rep, disabled }: RepCardProp) {
  const { setIsOpen, activeRep } = useActiveRep();
  const { imageUrl, loading } = useRepImage(rep);
  const showSkeleton = loading || !imageUrl;
  return (
    <motion.div
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => {
        if (!disabled && activeRep?.bioguide_id === rep.bioguide_id)
          setIsOpen(true);
      }}
      className={clsx(
        styles.repCardContainer,
        "relative flex flex-row shadow-lg",
      )}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: disabled ? "blur(10px)" : "blur(0px)",
      }}
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
          "absolute w-full h-full",
        )}
      >
        {showSkeleton ? (
          <Skeleton
            className={clsx(styles.skeleton, "rounded-[3rem]")}
            aria-hidden
          />
        ) : (
          <RepImageContainer portraitSrc={imageUrl} />
        )}
        <motion.h3
          layoutId={`rep-name-${rep.bioguide_id}`}
          className={styles.repName}
        >
          {/* {rep.full_name} */}
        </motion.h3>
      </motion.div>
    </motion.div>
  );
}
