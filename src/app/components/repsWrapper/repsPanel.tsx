"use client";

import RepDetailDrawer from "../repDetailDrawer/repDetailDrawer";
import RepRoster from "./RepRoster";
import type { RepsData } from "@/app/lib/definitions";
import { useRepStore } from "@/app/store/useRepStore";
import type { RepsLevel } from "@/app/components/repsLevelTabs/repsLevelTabs";
import { useEffect, type ComponentProps } from "react";

type RosterRows = ComponentProps<typeof RepRoster>["rows"];

/**
 * Renders the roster for the current tab + (federal only) the detail drawer.
 * Row data is built in the parent; this file only wires UI behavior.
 */
export default function RepsPanel({
  level,
  repsData,
  rosterRows,
}: {
  level: RepsLevel;
  repsData: RepsData;
  rosterRows: RosterRows;
}) {
  const { detailBioguideId, closeRepDetail, openRepDetail } =
    useRepStore();

  const federalReps = repsData.senateReps.concat(repsData.houseReps);
  const detailRep =
    detailBioguideId === null
      ? null
      : (federalReps.find((r) => r.bioguide_id === detailBioguideId) ??
        null);

  useEffect(() => {
    if (level === "state") closeRepDetail();
  }, [level, closeRepDetail]);

  return (
    <>
      <RepRoster
        rows={rosterRows}
        onRowDetails={
          level === "federal"
            ? (row) => openRepDetail(row.id)
            : (row) => {
                const url = row.externalUrl?.trim();
                if (url) {
                  window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }
              }
        }
        emptyMessage={
          level === "state"
            ? "State legislators are unavailable for this address right now."
            : undefined
        }
      />
      {level === "federal" ? (
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
