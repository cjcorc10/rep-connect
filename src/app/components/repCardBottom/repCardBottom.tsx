import { Rep } from "../../lib/definitions";
import styles from "./repCardBottom.module.scss";
import { useWikipedia } from "@/app/hooks/useWikipedia";
import { BlockText } from "../blockText/blockText";

type RepCardBottomProps = {
  rep: Rep;
};

const RepCardBottom = ({ rep }: RepCardBottomProps) => {
  const { wiki } = useWikipedia(rep.wikipedia_id);

  const expiration = new Date(rep.end);
  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = expiration.getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;

  return (
    <div className={styles.bottomSection}>
      <div className={styles.bottomExpiry}>
        <BlockText delay={0.25} animateOnScroll={false} stagger={0}>
          <p className={styles.bottomExpiryText}>
            {" "}
            Term Expires: {expiration.toLocaleDateString()}
          </p>

          {isNextMidTerm && (
            <div className={styles.bottomMidTerm}>
              This candidate is up for re-election in the next
              mid-term.
            </div>
          )}
        </BlockText>
      </div>
      <div className={styles.overviewSection}>
        {wiki && (
          <BlockText delay={0.25} animateOnScroll={false} stagger={0}>
            <h3 className={styles.sectionTitle}>Overview</h3>
            <p className={styles.sectionText}>{wiki.extract}</p>
          </BlockText>
        )}
      </div>
      <div className={styles.contactSection}>
        <BlockText delay={0.3} animateOnScroll={false} stagger={0}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <address className={styles.contactAddress}>
            <p className={styles.contactLine}>{rep.address}</p>
            <p className={styles.contactLine}>
              <a href={`tel:${rep.phone.replace(/\D/g, "")}`}>
                {rep.phone}
              </a>
            </p>
          </address>
        </BlockText>
      </div>
    </div>
  );
};

export default RepCardBottom;
