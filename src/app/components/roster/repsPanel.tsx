"use client";

import { Roster } from "./Roster";
import { RepRosterRow } from "@/app/lib/repRoster";

export default function RepsPanel({
  isFederal,
  rosterRows,
  portraitUrlMap,
}: {
  isFederal: boolean;
  rosterRows: RepRosterRow[];
  portraitUrlMap: Map<string, string>;
}) {
  return (
    <Roster
      rows={rosterRows}
      repMap={portraitUrlMap}
      isFederal={isFederal}
    />
  );
}
