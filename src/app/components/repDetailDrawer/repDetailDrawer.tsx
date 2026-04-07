"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Rep } from "@/app/lib/definitions";
import RepCardBottom from "../repCardBottom/repCardBottom";
import styles from "./repDetailDrawer.module.scss";

type ExternalLinkItem = { label: string; href: string };

function getRepExternalLinks(rep: Rep): ExternalLinkItem[] {
  const links: ExternalLinkItem[] = [];

  if (rep.opensecrets_id?.trim()) {
    links.push({
      label: "OpenSecrets",
      href: `https://www.opensecrets.org/members-of-congress/summary?cid=${encodeURIComponent(rep.opensecrets_id.trim())}`,
    });
  }

  const twitterHandle = rep.twitter?.trim().replace(/^@/, "");
  if (twitterHandle) {
    links.push({
      label: "Twitter",
      href: `https://twitter.com/${encodeURIComponent(twitterHandle)}`,
    });
  }

  if (rep.govtrack_id != null) {
    links.push({
      label: "GovTrack",
      href: `https://www.govtrack.us/congress/members/${rep.govtrack_id}`,
    });
  }

  if (rep.ballotpedia_id?.trim()) {
    const slug = rep.ballotpedia_id.trim().replace(/\s+/g, "_");
    links.push({
      label: "Ballotpedia",
      href: `https://ballotpedia.org/${slug}`,
    });
  }

  return links;
}

type RepDetailDrawerProps = {
  rep: Rep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const easeOutQuint = [0.23, 1, 0.32, 1] as const;
const panelTransition = {
  duration: 0.28,
  ease: easeOutQuint,
} as const;

export default function RepDetailDrawer({
  rep,
  open,
  onOpenChange,
}: RepDetailDrawerProps) {
  const [displayRep, setDisplayRep] = useState<Rep | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useLayoutEffect(() => {
    if (rep) setDisplayRep(rep);
  }, [rep]);

  const handlePanelAnimationComplete = () => {
    if (!openRef.current) {
      setDisplayRep(null);
    }
  };

  if (!displayRep) return null;

  const externalLinks = getRepExternalLinks(displayRep);

  return (
    <Dialog.Root modal={false} open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay forceMount asChild>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{
              opacity: open ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: easeOutQuint }}
            style={{ pointerEvents: open ? "auto" : "none" }}
          />
        </Dialog.Overlay>
        <Dialog.Content
          forceMount
          asChild
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <motion.div
            key={displayRep.bioguide_id}
            className={styles.panel}
            initial={{ transform: "translateX(100%)" }}
            animate={{
              transform: open
                ? "translateX(0%)"
                : "translateX(100%)",
            }}
            transition={panelTransition}
            onAnimationComplete={handlePanelAnimationComplete}
          >
            <header className={styles.header}>
              <div className={styles.headerText}>
                <Dialog.Title className={styles.repName}>
                  {displayRep.full_name}
                </Dialog.Title>
                <p className={styles.repMeta}>
                  {displayRep.party}
                  {" · "}
                  {displayRep.state}{" "}
                  {displayRep.type === "sen"
                    ? "Senator"
                    : `District ${displayRep.district}`}
                </p>
              </div>
              <Dialog.Close
                className={styles.closeButton}
                aria-label="Close details"
                type="button"
              >
                <X size={22} strokeWidth={2} aria-hidden />
              </Dialog.Close>
            </header>
            <div className={styles.body}>
              <RepCardBottom rep={displayRep} />
              {externalLinks.length > 0 ? (
                <section
                  className={styles.linksSection}
                  aria-labelledby="drawer-external-links-heading"
                >
                  <h2
                    id="drawer-external-links-heading"
                    className={styles.linksHeading}
                  >
                    Links
                  </h2>
                  <ul className={styles.linksList}>
                    {externalLinks.map(({ label, href }) => (
                      <li key={`${label}-${href}`} className={styles.linksItem}>
                        <a
                          href={href}
                          className={styles.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
