import { useState, useEffect } from "react";
import { useActiveRep } from "../activeRepContext";
import styles from "./menu.module.scss";
import MenuButton from "./menuButton";

export default function Menu() {
  const { activeRep, setSelectedReps } = useActiveRep();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!activeRep) return null;

  return (
    <div className={styles.menu} data-mounted={isMounted}>
      <div className={styles.menuButtons}>
        <MenuButton
          variant="phone"
          phone={activeRep.phone}
          color="#4760ff"
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
              setSelectedReps((prev) =>
                prev.some((r) => r.bioguide_id === activeRep.bioguide_id)
                  ? prev.filter((r) => r.bioguide_id !== activeRep.bioguide_id)
                  : [...prev, activeRep],
              );
            }}
          >
            details
          </MenuButton>
        </div>
      </div>
    </div>
  );
}
