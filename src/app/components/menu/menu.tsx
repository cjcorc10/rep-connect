import { useState, useEffect } from "react";
import styles from "./menu.module.scss";
import MenuButton from "./menuButton";
import { useRepStore } from "@/app/store/useRepStore";

export default function Menu() {
  const { activeRep, detailBioguideId, toggleRepDetail } =
    useRepStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!activeRep) return null;

  return (
    <div className={styles.menu} data-mounted={isMounted}>
      <div className={styles.menuBackground} />
      <div className={styles.menuButtons}>
        <MenuButton
          variant="phone"
          phone={activeRep.phone}
          color={`var(--primary-color)`}
        >
          call
        </MenuButton>
        <MenuButton
          variant="link"
          href={`https://twitter.com/${activeRep.twitter}`}
          color="#000000"
        >
          tweet
        </MenuButton>
        <MenuButton
          variant="link"
          href={`https://www.opensecrets.org/members-of-congress/summary?cid=${activeRep.opensecrets_id}`}
        >
          donations
        </MenuButton>
        <MenuButton
          variant="link"
          href={`https://www.govtrack.us/congress/members/${activeRep.govtrack_id}`}
        >
          legislation
        </MenuButton>
        <div className={styles.detailsButtonWrapper}>
          <MenuButton
            variant="button"
            onClick={() => {
              toggleRepDetail(activeRep.bioguide_id);
            }}
          >
            {detailBioguideId === activeRep.bioguide_id
              ? "close"
              : "details"}
          </MenuButton>
        </div>
      </div>
    </div>
  );
}
