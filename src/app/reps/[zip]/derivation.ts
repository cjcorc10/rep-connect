import type {
  DistrictGeoJson,
  DistrictMapFeature,
  RepsData,
  StateDistrict,
} from "@/app/lib/definitions";
import {
  districtFeatureName,
  districtNumberForMarker,
  districtStyleIndexByName,
  stateDistrictPaletteSlotByMapKey,
} from "@/app/lib/districtMapStyles";
import {
  buildFederalPartyColorByDistrictLabel,
  buildStateDistrictColorByMapKey,
  DEFAULT_PARTY_PALETTES,
  DEFAULT_STATE_DISTRICT_COLORS,
} from "@/app/components/districtMap/districtMapVisualConfig";
import {
  buildFederalRosterRows,
  stateLegislatorsToRosterRows,
} from "@/app/lib/repRoster";
import { districtsMatch, stateDistrictHasLegislator } from "./helper";

/** Federal district label → style rank for map/legend alignment. */
export function computeFederalDistrictRankByLabel(
  geo: DistrictGeoJson,
): Map<string, number> {
  const rankByLabel = new Map<string, number>();
  if (!geo) return rankByLabel;

  const styleIndexByName = districtStyleIndexByName(geo.features);

  geo.features.forEach((feature, i) => {
    const name = districtFeatureName(feature.properties?.name, i);
    const rank = styleIndexByName.get(name);
    if (rank == null) return;
    const label = districtNumberForMarker(
      feature.properties?.name,
      rank,
    );
    if (!rankByLabel.has(label)) {
      rankByLabel.set(label, rank);
    }
  });

  return rankByLabel;
}

export function computeFederalLegendColorFillByLabel(
  geo: DistrictGeoJson,
  houseReps: RepsData["houseReps"],
): Map<string, string> {
  if (!geo?.features?.length) return new Map();
  return buildFederalPartyColorByDistrictLabel(
    geo.features,
    houseReps,
    DEFAULT_PARTY_PALETTES,
  );
}

export function computeStateLegendColorFillByMapKey(
  stateGeo: DistrictGeoJson,
): Map<string, string> {
  if (!stateGeo?.features?.length) return new Map();
  return buildStateDistrictColorByMapKey(
    stateGeo.features,
    DEFAULT_STATE_DISTRICT_COLORS,
  );
}

export function lookupFederalLegendFill(
  district: string,
  colorFillByLabel: Map<string, string>,
): string | undefined {
  const key = String(district);
  if (colorFillByLabel.has(key)) return colorFillByLabel.get(key);
  for (const [label, color] of colorFillByLabel) {
    if (districtsMatch(key, label)) return color;
  }
  return undefined;
}

export function computeFederalRosterRows(data: RepsData) {
  return buildFederalRosterRows(data);
}

export function computeAlignedStateDistricts(
  stateDistricts: RepsData["stateDistricts"],
  stateLegislators: RepsData["stateLegislators"],
): StateDistrict[] {
  if (!stateLegislators.length) return stateDistricts;
  const matched = stateDistricts.filter((d: StateDistrict) =>
    stateDistrictHasLegislator(d, stateLegislators),
  );
  return matched.length > 0 ? matched : stateDistricts;
}

export function computeAlignedStateDistrictGeoJson(
  geo: DistrictGeoJson,
  stateLegislators: RepsData["stateLegislators"],
  alignedStateDistricts: StateDistrict[],
): DistrictGeoJson {
  if (!geo?.features?.length) return geo;
  if (!stateLegislators.length) return geo;

  const allowed = new Set(alignedStateDistricts.map((d) => d.mapKey));
  const features = geo.features.filter((feature: DistrictMapFeature) =>
    allowed.has(String(feature.properties?.mapKey ?? "")),
  );
  if (features.length === 0) return geo;
  return { type: "FeatureCollection", features };
}

export function computeStateDistrictRankByMapKey(
  stateGeo: DistrictGeoJson,
): Map<string, number> {
  if (!stateGeo?.features?.length) return new Map();
  return stateDistrictPaletteSlotByMapKey(stateGeo.features);
}

export function computeStateRosterRows(
  stateLegislators: RepsData["stateLegislators"],
) {
  return stateLegislatorsToRosterRows(stateLegislators);
}

export function filterStateSenateDistricts(
  aligned: StateDistrict[],
): StateDistrict[] {
  return aligned.filter((d) => d.chamberKey === "upper");
}

export function filterStateHouseDistricts(
  aligned: StateDistrict[],
): StateDistrict[] {
  return aligned.filter((d) => d.chamberKey === "lower");
}
