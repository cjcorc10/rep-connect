"use client";
import { motion } from "framer-motion";
import { type RepRosterRow } from "@/app/lib/repRoster";
import styles from "./roster.module.scss";
import { useState } from "react";
import { Carousel } from "../Carousel/carousel";
import { AnimatePresence } from "framer-motion";
import { Accordion } from "radix-ui";
import { getRepExternalLinks } from "../repDetailDrawer/repDetailDrawer";
import { useRepStore } from "@/app/store/useRepStore";
import { AccordionContent } from "../accordion/accordionContent";
import { AccordionTrigger } from "../accordion/accordionTrigger";
import { RosterColumnHeader } from "./rosterColumnHeader";
import { RosterRow } from "./rosterRow";
import Image from "next/image";
import {
  useWikipedia,
  prefetchWikipedia,
} from "@/app/hooks/useWikipedia";
import { Rep } from "@/app/lib/definitions";
import { useFollowPointer } from "@/app/hooks/useFollowPointer";
import { CursorIndicator } from "../Carousel/cursorIndicator";
import { CursorText } from "../Carousel/cursorText";

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
          {isHovered && (
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
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  const rep = useRepStore
                    .getState()
                    .getRep(row.id) as Rep;
                  prefetchWikipedia(rep.wikipedia_id);
                }}
              >
                <RosterRow row={row} isFederal={isFederal} />
              </AccordionTrigger>
            </Accordion.Header>
            {isFederal && (
              <AccordionContent className={styles.rowDetail}>
                <RowDetail bioguideId={row.id} repMap={repMap} />
              </AccordionContent>
            )}
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </>
  );
};
function twitterProfileUrl(rep: Rep): string | null {
  const handle = rep.twitter?.trim().replace(/^@/, "");
  if (!handle) return null;
  return `https://twitter.com/${encodeURIComponent(handle)}`;
}

const RowDetail = ({
  bioguideId,
  repMap,
}: {
  bioguideId: string;
  repMap: Map<string, string>;
}) => {
  const rep = useRepStore().getRep(bioguideId) as Rep;
  const { wiki, loading } = useWikipedia(rep.wikipedia_id);
  const twitterUrl = twitterProfileUrl(rep);
  const links = getRepExternalLinks(rep);
  const imageUrl = repMap.get(bioguideId);
  const expiration = new Date(rep.end);
  const isSenator = rep.type === "sen";

  return (
    <div className={styles.detailContainer}>
      <div className={styles.ImageContainer}>
        <div className={styles.imageBackground} />

        <motion.div className={styles.profileImage}>
          <Image
            src={imageUrl ?? ""}
            alt={rep.full_name}
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </div>
      <section className={styles.personalInfo}>
        <div className={styles.textContainer}>
          <p className={styles.textBlock}>{rep.full_name}</p>
          <p className={styles.textBlock}>
            {rep.party}{" "}
            {isSenator ? "Senator" : "Representative"}{" "}
          </p>
          <p className={styles.textBlock}>
            Term Expires: {expiration.toLocaleDateString()}
          </p>
        </div>
      </section>
      <section className={styles.detailBody}>
        <div className={styles.bioSection}>
          {wiki && (
            <>
              <h3 className={styles.sectionTitle}>Overview</h3>
              <p className={styles.detailBodyText}>
                {wiki.description}
              </p>
              <p className={styles.detailBodyText}>{wiki.extract}</p>
            </>
          )}
        </div>
        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>
            Find out more about {rep.full_name}
          </h3>
          <ul className={styles.linksList}>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.text}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          {twitterUrl && (
            <a href={twitterUrl} className={styles.detailFooterText}>
              Twitter
            </a>
          )}
          <a
            href={`tel:${rep.phone.replace(/\D/g, "")}`}
            className={styles.detailFooterText}
          >
            {rep.phone}
          </a>
          <a
            href={rep.contact_form}
            className={styles.detailFooterText}
          >
            Contact Form
          </a>
          <p className={styles.detailFooterText}>
            Mailing Address: {rep.address}
          </p>
        </div>
      </section>
    </div>
  );
};
