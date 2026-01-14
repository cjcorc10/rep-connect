"use client";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
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
  const { imageUrl, loading: imageLoading } = useRepImage(
    selectedRep as Rep
  );
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRep(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedRep]);

  if (!selectedRep) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = new Date(selectedRep.end).getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;
  // Use original image initially to prevent flash, only switch to high-quality when loaded
  // Check if imageUrl is different from original to know if a new image was fetched
  const portraitSrc =
    !imageLoading && imageUrl && imageUrl !== selectedRep.image_url
      ? imageUrl
      : selectedRep.image_url || "";
  const expiration = new Date(selectedRep.end);
  const partyColor = selectedRep.party === "Republican" ? "#F52727" : "#276CF5"
  return (
    <>
    <motion.div
      key={`modal-${selectedRep.bioguide_id}`}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={() => setSelectedRep(null)}
      >
      <motion.div
        layoutId={`rep-card-${selectedRep.bioguide_id}`}
        animate={{ transition: { duration: 3 } }}
        className={
          styles.modal}
          onClick={(e) => e.stopPropagation()}
          >
        <header className={styles.header}>
          <motion.div layoutId={`${selectedRep.bioguide_id}-partyColor`} style={{backgroundColor: partyColor}} className={styles.partyBG} />
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
          <motion.h1
            initial={{filter: 'blur(4px)'}}
            animate={{filter: 'blur(0)'}}
            layoutId={`${selectedRep.bioguide_id}-name`}
            className={styles.repName}
            >
            {selectedRep.full_name}
          </motion.h1>
        </header>
        <AnimatePresence>
          <motion.nav
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)'}}
            exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            transition={{
              duration: 0.5,
              delay: 0.5,
              ease: "easeOut",
            }}
            aria-label="Representative links"
            className={styles.nav}
            >
            <ul className={styles.navList}>
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
        <aside className={styles.midTerm}>
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
              </>
  );
}
