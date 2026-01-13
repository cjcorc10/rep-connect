"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedRep } from "../selectedRepContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import AnchorAsButton from "../anchorAsButton";
import { X } from "lucide-react";
import RepInfo from "../repInfo";
import clsx from "clsx";
import { useRepImage } from "../repCard/useRepImage";
import { Rep } from "../../lib/definitions";
import styles from "./selectedRepModal.module.scss";

type WikiData = {
  extract?: string;
  originalimage?: {
    source: string;
  };
};

export default function SelectedRepModal() {
  const { selectedRep, setSelectedRep } = useSelectedRep();
  const { imageUrl } = useRepImage(selectedRep as Rep);
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRep?.wikipedia_id) {
      setWiki(null);
      return;
    }

    setLoading(true);
    fetch(
      `/api/wikipedia/${encodeURIComponent(selectedRep.wikipedia_id)}`
    )
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setWiki(data);
      })
      .catch((err) => {
        console.error("Error fetching Wikipedia data:", err);
        setWiki(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRep?.wikipedia_id]);

  if (!selectedRep) {
    return null;
  }
  const role =
    selectedRep.type === "sen"
      ? `Senator for ${selectedRep.state}`
      : `Representative for ${selectedRep.state}`;

  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = new Date(selectedRep.end).getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;
  const portraitSrc = imageUrl || "";
  const expiration = new Date(selectedRep.end);

  return (
    <motion.div
      key={`modal-${selectedRep.bioguide_id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedRep(null)}
    >
      <motion.div
        layoutId={`rep-card-${selectedRep.bioguide_id}`}
        className={clsx(
          styles.modal,
          selectedRep.party === "Republican"
            ? "border-l-red-500 border-l-4"
            : "border-l-blue-500 border-l-4"
        )}
        onClick={(e) => e.stopPropagation()}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <button
          onClick={() => setSelectedRep(null)}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <header className="mx-auto max-w-5xl relative flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-6">
          <motion.div
            layoutId={`rep-image-${selectedRep.bioguide_id}`}
            className={styles.imageContainer}
          >
            <Image
              src={portraitSrc}
              alt={selectedRep.full_name}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className={styles.textContainer}>
              <motion.h1
                layoutId={`${selectedRep.bioguide_id}-name`}
                className={styles.repName}
              >
                <span className={styles.firstName}>
                {selectedRep.first_name.slice(0,1)}{" "}
                </span>
                <span className={styles.lastName}>
                {selectedRep.last_name}
                </span>
              </motion.h1>
              {/* <p
                className="text-base sm:text-lg mt-0.5"
              >
                {role}
              </p>
              <p >
                {selectedRep.party}
              </p> */}
          </div>
        </header>
        <AnimatePresence>
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
              ease: "easeOut",
            }}
            aria-label="Representative links"
            className="my-6"
          >
            <ul className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm sm:text-base">
              {selectedRep.phone && (
                <li>
                  <AnchorAsButton href={`tel:${selectedRep.phone}`}>
                    Call
                  </AnchorAsButton>
                </li>
              )}
              {selectedRep.twitter && (
                <li>
                  <AnchorAsButton
                    href={`https://twitter.com/${selectedRep.twitter}`}
                  >
                    Send tweet
                  </AnchorAsButton>
                </li>
              )}
              {selectedRep.opensecrets_id && (
                <li>
                  <AnchorAsButton
                    href={`https://www.opensecrets.org/members-of-congress/summary?cid=${selectedRep.opensecrets_id}`}
                  >
                    Follow the money
                  </AnchorAsButton>
                </li>
              )}
            </ul>
          </motion.nav>
        </AnimatePresence>
        <aside className="flex-1 flex flex-col items-center justify-center text-center sm:text-left mt-6 sm:mt-0">
          <h2 className="text-2xl font-bold">Term expires:</h2>
          <h3
            className={
              `text-xl` +
              (isNextMidTerm ? " text-red-600" : " text-gray-800")
            }
          >
            {expiration.toLocaleDateString()}
          </h3>
        </aside>
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3, duration: 0.3 },
            }}
            exit={{ opacity: 0 }}
          >
            <RepInfo
              rep={selectedRep}
              wiki={wiki}
              loading={loading}
              isNextMidTerm={isNextMidTerm}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
