"use client";

import { motion } from "framer-motion";
import styles from "./about.module.scss";

const fadeupVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <motion.div
        className={styles.column}
        variants={fadeupVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className={styles.title}>About</h1>

        <section className={styles.section}>
          <h2 className={styles.heading}>Purpose</h2>
          <p className={styles.body}>
            Rep Connect helps people find and contact the elected
            officials who represent their address. Elections choose
            who represents you, but donors and lobbyists don&apos;t
            stop working once the votes are counted. This app is meant
            to turn civic intent into action: look up your
            representatives, see your districts, and reach out with
            fewer clicks.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>How it works</h2>
          <p className={styles.body}>
            Search by ZIP to resolve matching federal and state
            districts. Toggle between levels, view district boundaries
            on a map, and open a roster with call and details actions.
            If a ZIP maps to more than one district, a refine step
            helps you pick the right one.
          </p>
        </section>

        <a
          className={styles.repoLink}
          href="https://github.com/cjcorc10/rep-connect"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </motion.div>
    </main>
  );
}
