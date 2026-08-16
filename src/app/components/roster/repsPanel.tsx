"use client";

import { Roster } from "./Roster";
import { RepRosterRow } from "@/app/lib/repRoster";
import { PortraitPrefetch } from "../Carousel/portraitPrefetch";

export default function RepsPanel({
  isFederal,
  rosterRows,
  portraitUrlMap,
  prefetchPortraitUrls,
}: {
  isFederal: boolean;
  rosterRows: RepRosterRow[];
  portraitUrlMap: Map<string, string>;
  prefetchPortraitUrls: string[];
}) {
  return (
    <>
      <PortraitPrefetch urls={prefetchPortraitUrls} />
      <Roster
        rows={rosterRows}
        repMap={portraitUrlMap}
        isFederal={isFederal}
      />
    </>
  );
}
