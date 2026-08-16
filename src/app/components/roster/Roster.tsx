"use client";
import { type RepRosterRow } from "@/app/lib/repRoster";
import styles from "./roster.module.scss";
import { useState } from "react";
import { Carousel } from "../Carousel/carousel";
import { AnimatePresence } from "framer-motion";
import { Accordion } from "radix-ui";
import { useRepStore } from "@/app/store/useRepStore";
import { AccordionContent } from "../accordion/accordionContent";
import { AccordionTrigger } from "../accordion/accordionTrigger";
import { RosterColumnHeader } from "./rosterColumnHeader";
import { RosterRow } from "./rosterRow";
import { prefetchWikipedia } from "@/app/hooks/useWikipedia";
import { Rep } from "@/app/lib/definitions";
import { useFollowPointer } from "@/app/hooks/useFollowPointer";
import { CursorIndicator } from "../Carousel/cursorIndicator";
import { CursorText } from "../Carousel/cursorText";
import { RowDetail } from "./rowDetail";
import { useIsMobile } from "@/app/hooks/useIsMobile";

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
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  if (isFederal) {
                    const rep = useRepStore
                      .getState()
                      .getRep(row.id) as Rep;
                    prefetchWikipedia(rep.wikipedia_id);
                  }
                }}
              >
                <RosterRow row={row} isFederal={isFederal} />
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
