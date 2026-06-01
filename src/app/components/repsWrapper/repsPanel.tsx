"use client";

import RepDetailDrawer from "../repDetailDrawer/repDetailDrawer";
import type { RepsData } from "@/app/lib/definitions";
import { useRepStore } from "@/app/store/useRepStore";
import type { GovLevel } from "@/app/components/govLevelTabs/govLevelTabs";
import { useEffect } from "react";
import { Roster } from "./Roster";
import { RepRosterRow } from "@/app/lib/repRoster";

export default function RepsPanel({
  isFederal,
  repsData,
  rosterRows,
  portraitUrlMap,
}: {
  isFederal: boolean;
  repsData: RepsData;
  rosterRows: RepRosterRow[];
  portraitUrlMap: Map<string, string>;
}) {
  const { detailBioguideId, closeRepDetail, openRepDetail } =
    useRepStore();

  const federalReps = repsData.senateReps.concat(repsData.houseReps);
  const detailRep =
    detailBioguideId === null
      ? null
      : (federalReps.find(
          (r) => r.bioguide_id === detailBioguideId,
        ) ?? null);

  useEffect(() => {
    if (!isFederal) closeRepDetail();
  }, [isFederal, closeRepDetail]);

  return (
    <>
      <Roster
        rows={rosterRows}
        onClickRow={(row) => {
          openRepDetail(row.id);
        }}
        repMap={portraitUrlMap}
        isFederal={isFederal}
      />
      {isFederal ? (
        <RepDetailDrawer
          rep={detailRep}
          open={detailBioguideId !== null && detailRep !== null}
          onOpenChange={(open) => {
            if (!open) closeRepDetail();
          }}
        />
      ) : null}
    </>
  );
}
