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

type Props = {
  address: string;
  data: RepsData;
};

export default function RepsPageClient({ address, data }: Props) {
  gsap.registerPlugin(SplitText);
  const [activeRep, setActiveRep] = useState<Rep | null>(null);

  return (
    <ActiveRepProvider
      activeRep={activeRep}
      setActiveRep={setActiveRep}
    >
      {/* <AnimatePresence>
        {activeRep ? (
          <motion.div
            className="fixed inset-0 bg-black/5 h-full z-40"
            style={{
              backdropFilter: "blur(5px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence> */}
      {/* {activeRep ? <ActiveRepModal /> : null} */}
      {activeRep ? <Menu /> : null}
      <motion.main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <section>
          <motion.header className="text-center">
            <Address address={address} />
            <h2 className="display-d1">Your Representatives</h2>
            <p className="display-d3 text-gray-700 mt-2">
              Find and contact your elected officials in Congress.
              Your voice matters in our democracy.
            </p>
          </motion.header>
        </section>
      </motion.main>
      <div className="px-4 sm:px-6 lg:px-8">
        <RepsWrapper data={data} />
      </div>
    </ActiveRepProvider>
  );
}
