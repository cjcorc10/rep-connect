"use client";

import type {
  Legend,
  MapSection,
  RepsByAddressPayload,
  RepsLocationPayload,
  Rep,
  StateLegislator,
} from "@/app/lib/definitions";
import { useRepStore } from "@/app/store/useRepStore";
import { useEffect, useState } from "react";
import {
  computeAlignedStateDistrictGeoJson,
  computeAlignedStateDistricts,
  computeFederalDistrictRankByLabel,
  computeFederalLegendColorFillByLabel,
  computeFederalRosterRows,
  computeStateDistrictRankByMapKey,
  computeStateLegendColorFillByMapKey,
  computeStateRosterRows,
  filterStateHouseDistricts,
  filterStateSenateDistricts,
} from "../reps/[zip]/derivation";
import { buildPortraitUrlMap } from "../lib/repRoster";
import {
  buildFederalImageApiUrl,
  buildStateImageApiURL,
} from "../lib/repImageUrl";
import { GovLevel } from "../components/govLevelTabs/govLevelTabs";

type UseRepsPageArgs = {
  payload: RepsLocationPayload;
};

export function useRepsPage({ payload }: UseRepsPageArgs) {
  const { setReps } = useRepStore();
  const [activeLevel, setActiveLevel] = useState<GovLevel>("federal");

  const [view, setView] = useState<RepsLocationPayload>(
    () => payload,
  );

  useEffect(() => {
    setView(payload);
  }, [payload]);

  useEffect(() => {
    setReps(
      view.data.senateReps.concat(view.data.houseReps) as Rep[],
    );
  }, [view.data.houseReps, view.data.senateReps, setReps]);

  const districtRankByLabel = computeFederalDistrictRankByLabel(
    view.districtGeoJson,
  );

  const federalLegendColorFillByLabel =
    computeFederalLegendColorFillByLabel(
      view.districtGeoJson,
      view.data.houseReps,
    );

  const federalRosterRows = computeFederalRosterRows(view.data);

  const alignedStateDistricts = computeAlignedStateDistricts(
    view.data.stateDistricts,
    view.data.stateLegislators,
  );

  const refineByAddress = async (
    address: string,
  ): Promise<RepsByAddressPayload> => {
    console.log("refineByAddress: ", address);
    const res = await fetch("/api/reps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) throw new Error("Failed to fetch reps");
    const data = await res.json();
    return data;
  };

  const alignedStateDistrictGeoJson =
    computeAlignedStateDistrictGeoJson(
      view.data.stateDistrictGeoJson,
      view.data.stateLegislators,
      alignedStateDistricts,
    );

  const stateDistrictRankByMapKey = computeStateDistrictRankByMapKey(
    alignedStateDistrictGeoJson,
  );

  const stateLegendColorFillByMapKey =
    computeStateLegendColorFillByMapKey(alignedStateDistrictGeoJson);

  const stateRosterRows = computeStateRosterRows(
    view.data.stateLegislators,
  );

  const stateSenateDistricts = filterStateSenateDistricts(
    alignedStateDistricts,
  );

  const stateHouseDistricts = filterStateHouseDistricts(
    alignedStateDistricts,
  );

  const federalPortraitUrlMap = buildPortraitUrlMap(
    view.data.senateReps.concat(view.data.houseReps),
    buildFederalImageApiUrl,
    (rep: Rep) => rep.bioguide_id,
  );
  const statePortraitUrlMap = buildPortraitUrlMap(
    view.data.stateLegislators,
    buildStateImageApiURL,
    (rep: StateLegislator) => rep.id,
  );

  const activeDistrictGeoJson =
    activeLevel === "state"
      ? alignedStateDistrictGeoJson
      : view.districtGeoJson;

  const onRefineSuccess = (next: RepsLocationPayload) => {
    setView(next);
  };

  const mapSection: MapSection = {
    districtGeoJson: activeDistrictGeoJson,
    mapFallback: view.mapFallback,
    level: activeLevel,
    houseReps:
      activeLevel === "federal" ? view.data.houseReps : undefined,
  };

  const legend: Legend = {
    level: activeLevel,
    stateCode: view.data.state,
    federal: {
      districts: view.data.districts,
      houseReps: view.data.houseReps,
      districtRankByLabel,
      districtColorFillByLabel: federalLegendColorFillByLabel,
    },
    state: {
      stateSenateDistricts,
      stateHouseDistricts,
      stateDistrictRankByMapKey,
      stateLegislators: view.data.stateLegislators,
      districtColorFillByMapKey: stateLegendColorFillByMapKey,
    },
  };

  const panel = {
    repsData: view.data,
    rosterRows:
      activeLevel === "federal" ? federalRosterRows : stateRosterRows,
    portraitUrlMap:
      activeLevel === "federal"
        ? federalPortraitUrlMap
        : statePortraitUrlMap,
  };

  const refine = {
    multipleDistricts: payload.data.houseReps.length > 1,
    onRefineSuccess,
    refineByAddress,
  };

  return {
    activeLevel,
    setActiveLevel,
    mapSection,
    legend,
    panel,
    refine,
  };
}
