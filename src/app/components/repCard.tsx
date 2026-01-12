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

  return (
    <motion.div
      layoutId={`rep-card-${rep.bioguide_id}`}
      onClick={() => setSelectedRep(rep)}
      className="mb-4 relative rounded-lg flex flex-row min-h-[175px] shadow-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {rep.district && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute right-[25%] top-[50%] text-7xl font-bold text-blue-200"
        >
          {rep.district}
        </motion.h3>
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
      <div className="flex flex-col flex-1 py-6 pr-6 justify-between">
        <div className=" flex flex-col gap-1">
          <motion.h3
            layoutId={`${rep.bioguide_id}-name`}
            className="text-2xl font-bold flex items-center text-blue-500"
          >
            {rep.full_name}
          </motion.h3>
          <p className="flex flex-row gap-2 text-gray-700 ">
            <MapPin color="black" size={20} /> {rep.address}
          </p>
          <p className="text-gray-700 flex flex-row gap-2">
            <Phone size={20} />
            {rep.phone}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
