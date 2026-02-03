"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedRep } from "../selectedRepContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import AnchorAsButton from "../anchorAsButton";
import RepInfo from "../repInfo";
import { useRepImage } from "../repCard/useRepImage";
import { Rep } from "../../lib/definitions";
import styles from "./selectedRepModal.module.scss";
import RepCard from "../repCard/repCard";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { Phone, Twitter, X } from "lucide-react";
import clsx from "clsx";

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
  const portraitSrc =
    !imageLoading && imageUrl && imageUrl !== selectedRep.image_url
      ? imageUrl
      : selectedRep.image_url || "";
  const expiration = new Date(selectedRep.end);

  return (
    <>
      <motion.div
        key={`modal-${selectedRep.bioguide_id}`}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={() => setSelectedRep(null)}
      >
        <motion.div
          className={styles.modal}
          layoutId={`rep-card-${selectedRep.bioguide_id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <header className={styles.header}>
            <div
              onClick={() => setSelectedRep(null)}
              className={styles.closeButton}
            >
              <X size={24} color="black" />
            </div>
            <motion.div
              layoutId={`rep-image-${selectedRep.bioguide_id}`}
              className={styles.imageContainer}
            >
              <RepImageContainer portraitSrc={portraitSrc} />
            </motion.div>
            <motion.h3
              className={styles.repName}
              layoutId={`rep-name-${selectedRep.bioguide_id}`}
            >
              {selectedRep.full_name}
            </motion.h3>
          </header>
          <aside className={styles.midTerm}>
            <h2 className={styles.midTermTitle}>
              Term expires:{" "}
              <span
                style={{
                  color: isNextMidTerm ? "red" : "black",
                }}
              >
                {expiration.toLocaleDateString()}
              </span>
            </h2>
          </aside>

          <AnimatePresence>
            <nav
              aria-label="Representative links"
              className={styles.nav}
            >
              <ul className={styles.navList}>
                {selectedRep.phone && (
                  <motion.li initial={{}}>
                    <AnchorAsButton href={`tel:${selectedRep.phone}`}>
                      <Phone size={24} color="white" />
                    </AnchorAsButton>
                  </motion.li>
                )}
                {selectedRep.twitter && (
                  <li>
                    <AnchorAsButton
                      href={`https://twitter.com/${selectedRep.twitter}`}
                    >
                      <Twitter size={24} color="white" />
                    </AnchorAsButton>
                  </li>
                )}
              </ul>
            </nav>
          </AnimatePresence>

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
