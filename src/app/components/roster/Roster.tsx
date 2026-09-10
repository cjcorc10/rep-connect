"use client";
import { type RepRosterRow } from "@/app/lib/repRoster";
import styles from "./roster.module.scss";
import { useEffect, useState } from "react";
import { Carousel } from "../Carousel/carousel";
import { AnimatePresence } from "framer-motion";
import { Accordion } from "radix-ui";
import { AccordionContent } from "../accordion/accordionContent";
import { AccordionTrigger } from "../accordion/accordionTrigger";
import { RosterColumnHeader } from "./rosterColumnHeader";
import { RosterRow } from "./rosterRow";
import { useFollowPointer } from "@/app/hooks/useFollowPointer";
import { CursorIndicator } from "../Carousel/cursorIndicator";
import { CursorText } from "../Carousel/cursorText";
import { RowDetail } from "./rowDetail";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";

type RosterProps = {
  rows: RepRosterRow[];
  repMap: Map<string, string>;
  isFederal: boolean;
  openItem: string;
  onOpenItemChange: (id: string) => void;
};

function scrollRosterRowIntoView(id: string, lenis?: Lenis) {
  const el = document.getElementById(`roster-row-${id}`);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, force: true });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const Roster = ({
  rows,
  repMap,
  isFederal,
  openItem,
  onOpenItemChange,
}: RosterProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const { x, y, parentRef } = useFollowPointer();
  const isMobile = useIsMobile();
  const lenis = useLenis();

  useEffect(() => {
    if (!openItem) return;
    // Defer past accordion trigger focus, which otherwise cancels the jump
    // when opening via a direct roster click.
    const frame = requestAnimationFrame(() => {
      scrollRosterRowIntoView(openItem, lenis);
    });
    return () => cancelAnimationFrame(frame);
  }, [openItem, lenis]);

  return (
    <>
      <div className={styles.rosterHeader}>
        <div className={styles.rosterTitleLine} />
        <h2 className={styles.rosterTitle}>Representatives</h2>
        <p className={styles.rosterDescription}>
          Select a representative from the roster to learn more. Each
          official profile contains external links with information
          about their donors, voting record, and background.
        </p>
        <div className={styles.arrowDownIcon}>
          <ArrowDownIcon width={52} height={52} />
        </div>
      </div>
      <Accordion.Root
        value={openItem}
        onValueChange={onOpenItemChange}
        type="single"
        className={styles.roster}
        ref={parentRef}
        collapsible
        onMouseLeave={() => setIsHovered(false)}
        onMouseEnter={() => setIsHovered(true)}
      >
        <AnimatePresence>
          {isHovered && !isMobile && (
            <>
              <Carousel
                coords={{ x, y }}
                openItem={openItem !== ""}
                repMap={repMap}
                hoveredIndex={hoveredIndex}
              />
              <CursorIndicator
                coords={{ x, y }}
                openItem={openItem !== ""}
              />
              <CursorText
                coords={{ x, y }}
                openItem={openItem !== ""}
                isFederal={isFederal}
              />
            </>
          )}
        </AnimatePresence>
        <RosterColumnHeader isFederal={isFederal} />
        {rows.map((row, index) => (
          <Accordion.Item
            value={row.id}
            key={row.id}
            id={`roster-row-${row.id}`}
          >
            <Accordion.Header>
              <AccordionTrigger
                className={styles.rosterRow}
                onClick={(e) => {
                  if (isFederal || !row.externalUrl) return;
                  e.preventDefault();
                  window.open(row.externalUrl, "_blank");
                }}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <RosterRow
                  row={row}
                  index={index}
                  isFederal={isFederal}
                />
              </AccordionTrigger>
            </Accordion.Header>
            {isFederal && (
              <AccordionContent className={styles.rowDetail}>
                <RowDetail
                  bioguideId={row.id}
                  repMap={repMap}
                  isMobile={isMobile}
                />
              </AccordionContent>
            )}
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
};
