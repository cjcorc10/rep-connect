"use client";

import { useEffect, useState, useRef } from "react";
import { Rep } from "../../lib/definitions";
import { useRepImage } from "../repCard/useRepImage";
import RepImageContainer from "../repImageContainer/repImageContainer";
import { useActiveRep } from "../activeRepContext";
import { X } from "lucide-react";
import styles from "./repDetailCard.module.scss";
import { motion } from "framer-motion";

type WikiData = {
  extract?: string;
  originalimage?: { source: string };
};

type RepDetailCardProps = {
  rep: Rep;
  positionLabel: string;
};

export default function RepDetailCard({
  rep,
  positionLabel,
}: RepDetailCardProps) {
  const { imageUrl } = useRepImage(rep);
  const { setSelectedReps } = useActiveRep();
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);
  const cardContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rep.wikipedia_id) {
      setWiki(null);
      return;
    }
    setLoading(true);
    fetch(`/api/wikipedia/${encodeURIComponent(rep.wikipedia_id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setWiki(data))
      .catch((err) => {
        console.error("Error fetching Wikipedia data:", err);
        setWiki(null);
      })
      .finally(() => setLoading(false));
  }, [rep.wikipedia_id]);

  const expiration = new Date(rep.end);
  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = expiration.getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;

  return (
    <motion.div
      className={styles.card}
      layoutId={`rep-card-${rep.bioguide_id}`}
    >
      <div ref={cardContentRef}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() =>
            setSelectedReps((prev) =>
              prev.filter((r) => r.bioguide_id !== rep.bioguide_id),
            )
          }
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className={styles.topSection}>
          <motion.div
            layoutId={`rep-image-${rep.bioguide_id}`}
            className={styles.imageWrapper}
          >
            <RepImageContainer portraitSrc={imageUrl} />
          </motion.div>
          <div className={styles.details}>
            <h2 className={styles.repName}>{rep.full_name}</h2>
            <p className={styles.position}>{positionLabel}</p>
            {rep.party && (
              <p className={styles.party}>Party: {rep.party}</p>
            )}
            <p className={styles.termExpiry}>
              Term Expires:{" "}
              <span
                className={styles.termDate}
                data-next-midterm={isNextMidTerm}
              >
                {expiration.toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        {isNextMidTerm && rep.phone && (
          <div className={styles.midTermAlert}>
            <p className={styles.midTermAlertTitle}>
              This candidate is up for re-election in the next
              mid-term. Candidates up for re-election are more likely
              to be responsive to constituents. Call today!
            </p>
          </div>
        )}
        <div className={styles.overviewSection}>
          <h3 className={styles.overviewTitle}>Overview</h3>
          <p className={styles.overviewText}>
            {loading
              ? "Loading..."
              : wiki?.extract ||
                "No additional information available."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
