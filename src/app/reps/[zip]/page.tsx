"use client";
import Address from "@/app/components/address/address";
import RepFetchWrapper from "@/app/components/repFetchWrapper";
import { SelectedRepProvider } from "@/app/components/selectedRepContext";
import SelectedRepModal from "@/app/components/selectedRepModal/selectedRepModal";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Rep } from "@/app/lib/definitions";
import { AnimatePresence, motion } from "framer-motion";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);

  const address = useMemo(() => {
    const zip = params.zip as string;
    const street = searchParams.get("street");
    return street ? `${street}, ${zip}` : zip;
  }, [params.zip, searchParams]);

  return (
    <SelectedRepProvider
      selectedRep={selectedRep}
      setSelectedRep={setSelectedRep}
    >
      <AnimatePresence>
        {selectedRep ? (
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
      </AnimatePresence>
      {selectedRep ? <SelectedRepModal /> : null}
      <motion.main
        className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        animate={{
          filter: selectedRep ? "blur(5px)" : "blur(0px)",
          transition: { duration: 0.2 },
        }}
      >
        <section className="max-w-6xl mx-auto">
          <header className="text-center">
            <Address address={address} />
            <h2 className="display-d2 font-bold">
              Your Representatives
            </h2>
            <p className="text-t1 text-gray-700 mt-2">
              Find and contact your elected officials in Congress.
              Your voice matters in our democracy.
            </p>
          </header>
          <RepFetchWrapper address={address} />
        </section>
      </motion.main>
    </SelectedRepProvider>
  );
}
