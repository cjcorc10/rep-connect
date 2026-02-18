"use client";

import Address from "@/app/components/address/address";
import RepsWrapper from "@/app/components/repsWrapper/repsWrapper";
import { ActiveRepProvider } from "@/app/components/activeRepContext";
import { useState } from "react";
import type { Rep, RepsData } from "@/app/lib/definitions";
import { motion } from "framer-motion";
import gsap from "gsap";
import SplitText from "gsap/all";
import Menu from "@/app/components/menu/menu";
import { ArrowDownIcon } from "lucide-react";

type Props = {
  address: string;
  data: RepsData;
};

export default function RepsPageClient({ address, data }: Props) {
  gsap.registerPlugin(SplitText);
  const [activeRep, setActiveRep] = useState<Rep | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ActiveRepProvider
      activeRep={activeRep}
      setActiveRep={setActiveRep}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {activeRep ? <Menu /> : null}
      <motion.main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 h-[94vh]">
        <section>
          <header>
            <Address address={address} />
            <div className="md:pl-12 ">
              <h2 className="text-center md:text-left display-d1">
                Your Representatives
              </h2>
              <p className="display-d3 text-gray-700 mt-4">
                Find and contact your elected officials in Congress.
                Your voice matters in our democracy.
              </p>
            </div>
          </header>
        </section>
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center"
        >
          <ArrowDownIcon size={148} color="var(--accent-indigo)" />
        </motion.div>
      </motion.main>
      <div className="px-4 sm:px-6 lg:px-8">
        <RepsWrapper data={data} />
      </div>
    </ActiveRepProvider>
  );
}
