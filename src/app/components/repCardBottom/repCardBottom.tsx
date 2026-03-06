import { Rep } from "../../lib/definitions";
import styles from "./repCardBottom.module.scss";
import { useWikipedia } from "@/app/hooks/useWikipedia";
import { motion } from "framer-motion";

type RepCardBottomProps = {
  rep: Rep;
};

const RepCardBottom = ({ rep }: RepCardBottomProps) => {
  const { wiki, loading } = useWikipedia(rep.wikipedia_id);

  const expiration = new Date(rep.end);
  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = expiration.getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;

  return (
    <motion.div className={styles.bottomSection}>
      <div className={styles.bottomExpiry}>
        Term Expires: {expiration.toLocaleDateString()}
        {isNextMidTerm && (
          <div className={styles.bottomMidTerm}>
            This candidate is up for re-election in the next mid-term.
          </div>
        )}
      </div>
      <div className={styles.overviewSection}>
        <h3 className={styles.sectionTitle}>Overview</h3>
        {loading && (
          <div className={styles.bottomLoading}>Loading...</div>
        )}
        {!loading && wiki?.extract && (
          <p className={styles.sectionText}>{wiki.extract}</p>
        )}
      </div>
      <div className={styles.contactSection}>
        <h3 className={styles.sectionTitle}>Contact</h3>
        <address className={styles.contactAddress}>
          <p className={styles.contactLine}>{rep.address}</p>
          <p className={styles.contactLine}>
            <a href={`tel:${rep.phone.replace(/\D/g, "")}`}>
              {rep.phone}
            </a>
          </p>
        </address>
      </div>
    </motion.div>
  );
};

export default RepCardBottom;
