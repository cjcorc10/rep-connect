"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Rep } from "@/app/lib/definitions";
import RepCardBottom from "../repCardBottom/repCardBottom";
import styles from "./repDetailDrawer.module.scss";

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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
        <Dialog.Content forceMount asChild>
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
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
