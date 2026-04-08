"use client";

import React, { useEffect, useMemo, useState } from "react";
import RepDetailDrawer from "../repDetailDrawer/repDetailDrawer";
import { resolveRepPortraitUrl } from "../repCard/useRepImage";
import RepRoster from "./RepRoster";
import type { RepsData } from "@/app/lib/definitions";
import { buildFederalRosterRows } from "@/app/lib/repRoster";
import { useRepStore } from "@/app/store/useRepStore";

export default function RepsWrapper({
  repsData,
  districtColorByDistrict,
}: {
  repsData: RepsData;
  districtColorByDistrict?: Record<
    string,
    { fill: string; stroke: string }
  >;
}) {
  const { detailBioguideId, closeRepDetail, openRepDetail } =
    useRepStore();

  const reps = repsData.senateReps.concat(repsData.houseReps)
  const rows = buildFederalRosterRows(repsData, districtColorByDistrict)


  const [portraitByRowId, setPortraitByRowId] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      reps.map((rep) =>
        resolveRepPortraitUrl(rep).then(
          (url) => [rep.bioguide_id, url] as const,
        ),
      ),
    ).then((entries) => {
      if (cancelled) return;
      setPortraitByRowId(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [reps]);

  const detailRep =
    detailBioguideId === null
      ? null
      : (reps.find((r) => r.bioguide_id === detailBioguideId) ??
        null);

  return (
    <>
      <RepRoster
        rows={rows}
        portraitByRowId={portraitByRowId}
        onRowDetails={(row) => {
          openRepDetail(row.id);
        }}
      />
      <RepDetailDrawer
        rep={detailRep}
        open={detailBioguideId !== null && detailRep !== null}
        onOpenChange={(next) => {
          if (!next) closeRepDetail();
        }}
      />
    </>
  );
}
