import { useState, useEffect } from "react";
import { useActiveRep } from "../activeRepContext";
import styles from "./menu.module.scss";
import MenuButton from "./menuButton";

export default function Menu() {
  const { activeRep, isOpen, setIsOpen } = useActiveRep();
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
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "close" : "details"}
          </MenuButton>
        </div>
      </div>
    </div>
  );
}
