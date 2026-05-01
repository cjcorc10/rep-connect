"use client";

import type {
  Rep,
  RepsByAddressPayload,
  RepsLocationPayload,
} from "@/app/lib/definitions";
import { useRepStore } from "@/app/store/useRepStore";
import { useEffect, useState } from "react";
import {
  computeAlignedStateDistrictGeoJson,
  computeAlignedStateDistricts,
  computeFederalDistrictRankByLabel,
  computeFederalHouseColors,
  computeFederalRosterRows,
  computeStateDistrictColorFillByMapKey,
  computeStateDistrictRankByMapKey,
  computeStateRosterRows,
  filterStateHouseDistricts,
  filterStateSenateDistricts,
} from "../reps/[zip]/derivation";

type UseRepsPageArgs = {
  payload: RepsLocationPayload;
};

type RefineSuccessPayload = Pick<
  RepsByAddressPayload,
  "data" | "cityStateLabel" | "districtGeoJson" | "mapFallback"
>;

export function useRepsPage({ payload }: UseRepsPageArgs) {
  const { setReps } = useRepStore();

  const [activeLevel, setActiveLevel] = useState<"federal" | "state">(
    "federal",
  );
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

  const federalHouseColors = computeFederalHouseColors(
    view.data.districts,
    districtRankByLabel,
  );

  const federalRosterRows = computeFederalRosterRows(
    view.data,
    federalHouseColors,
  );

  const alignedStateDistricts = computeAlignedStateDistricts(
    view.data.stateDistricts,
    view.data.stateLegislators,
  );

  const alignedStateDistrictGeoJson =
    computeAlignedStateDistrictGeoJson(
      view.data.stateDistrictGeoJson,
      view.data.stateLegislators,
      alignedStateDistricts,
    );

  const stateDistrictRankByMapKey = computeStateDistrictRankByMapKey(
    alignedStateDistrictGeoJson,
  );

  const stateDistrictColorFillByMapKey =
    computeStateDistrictColorFillByMapKey(stateDistrictRankByMapKey);

  const stateRosterRows = computeStateRosterRows(
    view.data.stateLegislators,
    alignedStateDistricts,
    stateDistrictColorFillByMapKey,
  );

  const stateSenateDistricts = filterStateSenateDistricts(
    alignedStateDistricts,
  );

  const stateHouseDistricts = filterStateHouseDistricts(
    alignedStateDistricts,
  );

  const activeDistrictGeoJson =
    activeLevel === "state"
      ? alignedStateDistrictGeoJson
      : view.districtGeoJson;

  function onRefineSuccess(next: RefineSuccessPayload) {
    setView(next);
  }

  const mapSection = {
    districtGeoJson: activeDistrictGeoJson,
    mapFallback: view.mapFallback,
  };

  const legend = {
    level: activeLevel,
    stateCode: view.data.state,
    federal: {
      districts: view.data.districts,
      houseReps: view.data.houseReps,
      districtRankByLabel,
    },
    state: {
      stateSenateDistricts,
      stateHouseDistricts,
      stateDistrictRankByMapKey,
      stateLegislators: view.data.stateLegislators,
    },
  };

  const panel = {
    repsData: view.data,
    rosterRows:
      activeLevel === "federal" ? federalRosterRows : stateRosterRows,
  };

  const refine = {
    multipleDistricts: payload.data.houseReps.length > 1,
    onRefineSuccess,
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
