"use client";
import Image from "next/image";
import { Rep } from "../../lib/definitions";
import { useSelectedRep } from "../selectedRepContext";
import { motion } from "framer-motion";
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
  return (
    <motion.div
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setSelectedRep(rep)}
      className={clsx(
        styles.repCard,

        rep.party === "Republican"
          ? "border-l-red-500 border-l-4"
          : "border-l-blue-500 border-l-4",
        "relative rounded-xl flex flex-row shadow-lg hover:bg-gray-50 cursor-pointer overflow-hidden h-[65vh]"
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
        className="absolute w-full h-full overflow-hidden shadow-md"
      >
        <Image
          src={imageUrl || rep.image_url || ""}
          fill
          alt={rep.full_name}
          style={{ objectFit: "cover", objectPosition: "" }}
        />
      </motion.div>
      <div className="flex flex-col justify-center">
        <div className=" flex flex-col gap-1 z-20">
          <motion.h3
            layoutId={`${rep.bioguide_id}-name`}
            className="text-2xl font-bold flex items-center text-white"
          >
            {rep.full_name}
          </motion.h3>
          <motion.p layoutId={`${rep.bioguide_id}-role`}>
            {role}
          </motion.p>
          <motion.p layoutId={`${rep.bioguide_id}-party`}>
            {rep.party}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
