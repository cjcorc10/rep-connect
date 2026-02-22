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
      <main className="py-4 sm:py-6 h-[100vh] relative flex flex-col">
        <section>
          <header>
            <Address address={address} />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="overflow-clip h-full w-[100vw] relative"
            >
              <h2
                className="text-center uppercase display-d1 overflow-clip"
                style={{
                  fontSize: "clamp(1.25rem, 5vw + 0.75rem, 10rem)",
                  color: "#1a1500",
                }}
              >
                Representatives
              </h2>
              <p
                className="display-d2 text-gray-700 mt-2 text-center "
                style={{
                  fontSize: "clamp(0.875rem, 1.5vw + 1rem, 2rem)",
                  color: "#1a1500",
                }}
              >
                Find and contact your elected officials in Congress.
                Your voice matters in our democracy.
              </p>
            </motion.div>
          </header>
        </section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 2 },
            y: {
              duration: 2,
              delay: 2,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center"
        >
          <ArrowDownIcon size={148} color="#ff6969" />
        </motion.div>
      </main>
      <div className="px-4 sm:px-6 lg:px-8">
        <RepsWrapper data={data} />
      </div>
    </ActiveRepProvider>
  );
}
