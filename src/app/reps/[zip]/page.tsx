"use client";
import Address from "@/app/components/address/address";
import RepFetchWrapper from "@/app/components/repFetchWrapper";
import { SelectedRepProvider } from "@/app/components/selectedRepContext";
import SelectedRepModal from "@/app/components/selectedRepModal";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Rep } from "@/app/lib/definitions";
import { AnimatePresence, motion } from "framer-motion";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  // State variable to hold the currently selected rep data
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
            className="fixed inset-0 bg-black/50 h-full z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>
      {selectedRep ? <SelectedRepModal /> : null}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <section className="max-w-6xl mx-auto">
          <header className="text-center">
            <Address address={address} />
            <h2 className="text-[3rem] font-bold mt-4">
              Your Representatives
            </h2>
            <p className="text-lg text-gray-700">
              Find and contact your elected officials in Congress.
              Your voice matters in our democracy.
            </p>
          </header>
          <RepFetchWrapper address={address} />
        </section>
      </main>
    </SelectedRepProvider>
  );
}
