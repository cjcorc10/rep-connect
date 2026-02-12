"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveRep } from "../activeRepContext";
import { useEffect, useState } from "react";
import AnchorAsButton from "../anchorAsButton";
import RepInfo from "../repInfo";
import { useRepImage } from "../repCard/useRepImage";
import { Rep } from "../../lib/definitions";
import styles from "./selectedRepModal.module.scss";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { Phone, Twitter, X } from "lucide-react";

type WikiData = {
  extract?: string;
  originalimage?: {
    source: string;
  };
};

export default function SelectedRepModal() {
  const { activeRep, setIsOpen } = useActiveRep();
  const { imageUrl } = useRepImage(activeRep as Rep);
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeRep?.wikipedia_id) {
      setWiki(null);
      return;
    }

    setLoading(true);
    fetch(
      `/api/wikipedia/${encodeURIComponent(activeRep.wikipedia_id)}`,
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
  }, [activeRep?.wikipedia_id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  if (!activeRep) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = new Date(activeRep.end).getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;

  const expiration = new Date(activeRep.end);

  return (
    <>
      <motion.div
        key={`modal-${activeRep.bioguide_id}`}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={() => setIsOpen(false)}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          className={styles.closeButton}
          aria-label="Close"
        >
          <X size={24} color="black" />
        </div>
        <motion.div
          className={styles.modal}
          layoutId={`rep-card-${activeRep.bioguide_id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <header className={styles.header}>
            <motion.div
              layoutId={`rep-image-${activeRep.bioguide_id}`}
              className={styles.imageContainer}
            >
              <RepImageContainer portraitSrc={imageUrl} />
            </motion.div>
            <motion.h3
              className={styles.repName}
              layoutId={`rep-name-${activeRep.bioguide_id}`}
            >
              {activeRep.full_name}
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
                {activeRep.phone && (
                  <motion.li initial={{}}>
                    <AnchorAsButton href={`tel:${activeRep.phone}`}>
                      <Phone size={24} color="white" />
                    </AnchorAsButton>
                  </motion.li>
                )}
                {activeRep.twitter && (
                  <li>
                    <AnchorAsButton
                      href={`https://twitter.com/${activeRep.twitter}`}
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
                rep={activeRep}
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
