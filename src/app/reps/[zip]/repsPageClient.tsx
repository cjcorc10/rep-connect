"use client";

import Address from "@/app/components/address/address";
import RepsWrapper from "@/app/components/repsWrapper/repsWrapper";
import type { Rep, RepsData } from "@/app/lib/definitions";
import { motion } from "framer-motion";
import Menu from "@/app/components/menu/menu";
import { ArrowDownIcon } from "lucide-react";
import { useRepStore } from "@/app/store/useRepStore";
import { useEffect } from "react";
import styles from "./repsPageClient.module.scss";
import Banner from "@/app/components/banner/banner";

type Props = {
  address: string;
  data: RepsData;
};

export default function RepsPageClient({ address, data }: Props) {
  const { activeRep, setReps } = useRepStore();
  useEffect(() => {
    setReps(data.senateReps.concat(data.houseReps) as Rep[]);
  }, []);

  return (
    <>
      {activeRep ? <Menu /> : null}
      <main className="py-4 sm:py-6 h-[100vh] relative flex flex-col items-center justify-center">
        <section className={styles.headerSection}>
          <header className={styles.header}>
            <div className={styles.addressContainer}>
              <h1>Showing results for</h1>
              {/* Derive zip from search */}
              <h1 className={styles.addressText}>{address}</h1>
            </div>
            <div className={styles.cityContainer}>
              {/* Derive city from search */}
              <h1>San Antonio, TX</h1>
            </div>
          </header>
          <div className={styles.mapContainer}></div>
        </section>
      </main>
      <Banner />
      <div>
        <RepsWrapper repsData={data} />
      </div>
    </>
  );
}
