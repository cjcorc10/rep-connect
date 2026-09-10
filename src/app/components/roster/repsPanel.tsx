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
  openItem,
  onOpenItemChange,
}: {
  isFederal: boolean;
  rosterRows: RepRosterRow[];
  portraitUrlMap: Map<string, string>;
  prefetchPortraitUrls: string[];
  prefetchWikipediaIds: string[];
  openItem: string;
  onOpenItemChange: (id: string) => void;
}) {
  return (
    <>
      {isFederal && <WikiPrefetch ids={prefetchWikipediaIds} />}
      <PortraitPrefetch urls={prefetchPortraitUrls} />
      <Roster
        rows={rosterRows}
        repMap={portraitUrlMap}
        isFederal={isFederal}
        openItem={openItem}
        onOpenItemChange={onOpenItemChange}
      />
    </>
  );
}
