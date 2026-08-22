"use client";

import { Roster } from "./Roster";
import { RepRosterRow } from "@/app/lib/repRoster";
import { PortraitPrefetch } from "../Carousel/portraitPrefetch";
import { WikiPrefetch } from "./wikiPrefetch";

export default function RepsPanel({
  isFederal,
  rosterRows,
  portraitUrlMap,
  prefetchPortraitUrls,
  prefetchWikipediaIds,
}: {
  isFederal: boolean;
  rosterRows: RepRosterRow[];
  portraitUrlMap: Map<string, string>;
  prefetchPortraitUrls: string[];
  prefetchWikipediaIds: string[];
}) {
  return (
    <>
      {isFederal && <WikiPrefetch ids={prefetchWikipediaIds} />}
      <PortraitPrefetch urls={prefetchPortraitUrls} />
      <Roster
        rows={rosterRows}
        repMap={portraitUrlMap}
        isFederal={isFederal}
      />
    </>
  );
}
