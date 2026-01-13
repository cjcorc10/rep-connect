"use client";
import Image from "next/image";
import { Rep } from "../../lib/definitions";
import { useSelectedRep } from "../selectedRepContext";
import { motion } from "framer-motion";
import PartyBadge from "../partyBadge";
import clsx from "clsx";
import styles from "./repCard.module.css";

type RepCardProp = {
  rep: Rep;
};

export default function RepCard({ rep }: RepCardProp) {
  const { setSelectedRep } = useSelectedRep();
  const role =
    rep.type === "sen"
      ? `Senator for ${rep.state}`
      : `Representative for ${rep.state}`;
  return (
    <motion.div
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setSelectedRep(rep)}
      className={clsx(
        rep.party === "Republican"
          ? "border-l-red-500 border-l-2"
          : "border-l-blue-500 border-l-2",
        "relative flex flex-row shadow-lg bg-white  hover:bg-gray-50 cursor-pointer py-6"
      )}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="flex justify-center p-8 items-center w-[140px] relative">
        <motion.div
          layoutId={`rep-image-${rep.bioguide_id}`}
          className="absolute w-[100px] h-[100px] rounded-full overflow-hidden shadow-md transform origin-center"
        >
          <Image
            src={rep.image_url || ""}
            fill
            alt={rep.full_name}
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </motion.div>
        {/* <motion.div
          layoutId={`${rep.bioguide_id}-party-badge`}
          className="w-6 h-6 transform translate-[150%]"
        >
          <PartyBadge party={rep.party} />
        </motion.div> */}
      </div>
      <div className="flex flex-col justify-center">
        <div className=" flex flex-col gap-1 z-20">
          <motion.h3
            layoutId={`${rep.bioguide_id}-name`}
            className="text-2xl font-bold flex items-center text-blue-500"
          >
            {rep.full_name}
          </motion.h3>
          <motion.p layoutId={`${rep.bioguide_id}-role`}>
            {role}
          </motion.p>
          <motion.p>{rep.party}</motion.p>
        </div>
      </div>
    </motion.div>
  );
}
