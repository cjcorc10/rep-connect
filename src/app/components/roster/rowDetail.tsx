import styles from "./roster.module.scss";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRepStore } from "@/app/store/useRepStore";
import { Rep } from "@/app/lib/definitions";
import { useWikipedia } from "@/app/hooks/useWikipedia";
import Image from "next/image";
import { useRef } from "react";
import { useEffect } from "react";
import { MaskText } from "../maskText/maskText";
import { useIsMobile } from "@/app/hooks/useIsMobile";

function twitterProfileUrl(rep: Rep): string | null {
  const handle = rep.twitter?.trim().replace(/^@/, "");
  if (!handle) return null;
  return `https://twitter.com/${encodeURIComponent(handle)}`;
}

type ExternalLinkItem = { href: string; text: string };

export function getRepExternalLinks(rep: Rep): ExternalLinkItem[] {
  const links: ExternalLinkItem[] = [];

  if (rep.opensecrets_id?.trim()) {
    links.push({
      href: `https://www.opensecrets.org/members-of-congress/summary?cid=${encodeURIComponent(rep.opensecrets_id.trim())}`,
      text: "Who is funding this representative?",
    });
  }

  if (rep.govtrack_id != null) {
    links.push({
      href: `https://www.govtrack.us/congress/members/${rep.govtrack_id}`,
      text: "Voting history and sponsored bills",
    });
  }

  if (rep.ballotpedia_id?.trim()) {
    const slug = rep.ballotpedia_id.trim().replace(/\s+/g, "_");
    links.push({
      href: `https://ballotpedia.org/${slug}`,
      text: "Background and positions",
    });
  }

  return links;
}

export const RowDetail = ({
  bioguideId,
  repMap,
  isMobile,
}: {
  bioguideId: string;
  repMap: Map<string, string>;
  isMobile: boolean;
}) => {
  const rep = useRepStore().getRep(bioguideId) as Rep;
  const { wiki } = useWikipedia(rep.wikipedia_id);
  const twitterUrl = twitterProfileUrl(rep);
  const links = getRepExternalLinks(rep);
  const imageUrl = repMap.get(bioguideId);
  const expiration = new Date(rep.end);
  const isSenator = rep.type === "sen";
  const target = useRef(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["25% end", "75% start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);

  return (
    <div ref={target} className={styles.detailContainer}>
      <motion.div
        style={isMobile ? undefined : { y }}
        className={styles.ImageContainer}
      >
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{
            duration: 0.6,
            delay: 0.25,
            ease: "easeOut",
          }}
          className={styles.imageBackground}
        />

        <motion.div
          initial={{
            clipPath: "inset(0 0 100% 0)",
            filter: "blur(10px)",
          }}
          animate={{
            clipPath: "inset(0 0 0% 0)",
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.6,
            delay: 0.26,
            ease: "easeOut",
          }}
          className={styles.profileImage}
        >
          <Image
            src={imageUrl ?? ""}
            alt={rep.full_name}
            fill
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </motion.div>
      <section className={styles.personalInfo}>
        <MaskText delay={0.15} direction="down">
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
        </MaskText>
      </section>
      <section className={styles.detailBody}>
        <MaskText delay={0.25} direction="down">
          <div className={styles.bioSection}>
            {wiki && (
              <>
                <h3 className={styles.sectionTitle}>Overview</h3>
                <p className={styles.detailBodyText}>
                  {wiki.description}
                </p>
                <p className={styles.detailBodyText}>
                  {wiki.extract}
                </p>
              </>
            )}
          </div>
        </MaskText>
        <MaskText delay={0.25} direction="down">
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
        </MaskText>
        <MaskText delay={0.25} direction="down">
          <div className={styles.contactSection}>
            <h3 className={styles.sectionTitle}>Contact</h3>
            {twitterUrl && (
              <a
                href={twitterUrl}
                className={styles.detailFooterText}
              >
                Twitter
              </a>
            )}
            <a
              href={`tel:${rep.phone.replace(/\D/g, "")}`}
              className={styles.detailFooterText}
            >
              {rep.phone}
            </a>
            {rep.contact_form && (
              <a
                href={rep.contact_form}
                className={styles.detailFooterText}
              >
                Contact Form
              </a>
            )}
            <p className={styles.detailFooterText}>
              Mailing Address: {rep.address}
            </p>
          </div>
        </MaskText>
      </section>
    </div>
  );
};
