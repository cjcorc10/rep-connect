"use client";
import Image from "next/image";
import { Rep } from "../lib/definitions";
import { Phone, MapPin } from "lucide-react";
import { useSelectedRep } from "./selectedRepContext";
import { motion } from "framer-motion";
import PartyBadge from "./partyBadge";

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
      className="mb-4 relative rounded-lg flex flex-row min-h-[175px] shadow-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {rep.district && (
        <h3
            className="absolute right-[10%] top-[50%] text-7xl font-bold text-blue-200 z-10"
        >
          {rep.district}
        </h3>
      )}
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
        <motion.div
          layoutId={`${rep.bioguide_id}-party-badge`}
          className="absolute bottom-[40px] right-[20px] w-6 h-6"
        >
          <PartyBadge party={rep.party} />
        </motion.div>
      </div>
      <div className="flex flex-col justify-center">
        <div className=" flex flex-col gap-1 z-20">
          <motion.h3
            layoutId={`${rep.bioguide_id}-name`}
            className="text-2xl font-bold flex items-center text-blue-500"
          >
            {rep.full_name}
          </motion.h3>
          <motion.p 
            layoutId={`${rep.bioguide_id}-role`}
            className="text-base text-lg mt-0.5">{role}</motion.p>

        </div>
      </div>
    </motion.div>
  );
}
