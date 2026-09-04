"use client";
import { type RepRosterRow } from "@/app/lib/repRoster";
import styles from "./roster.module.scss";
import { useState } from "react";
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

type RosterProps = {
  rows: RepRosterRow[];
  repMap: Map<string, string>;
  isFederal: boolean;
};

export const Roster = ({ rows, repMap, isFederal }: RosterProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [openItem, setOpenItem] = useState("");
  const { x, y, parentRef } = useFollowPointer();
  const isMobile = useIsMobile();

  return (
    <>
      <div className={styles.rosterHeader}>
        <div className={styles.rosterTitleLine} />
        <h2 className={styles.rosterTitle}>Representatives</h2>
        <p className={styles.rosterDescription}>
          Select a representative from the roster to learn more.
          Officials with terms that end in the upcoming election cycle
          are highlighted in red.
        </p>
        <div className={styles.arrowDownIcon}>
          <ArrowDownIcon width={52} height={52} />
        </div>
      </div>
      <Accordion.Root
        value={openItem}
        onValueChange={setOpenItem}
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
          <Accordion.Item value={row.id} key={row.id}>
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
