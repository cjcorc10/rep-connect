import type { RepsByAddressPayload } from "@/app/lib/definitions";
import type { FederalHouseColorsByDistrict } from "@/app/lib/districtMapStyles";
import {
  districtFeatureName,
  districtNumberForMarker,
  districtStyleIndexByName,
  federalHouseColorsForDistricts,
  paletteForDistrictRank,
} from "@/app/lib/districtMapStyles";
import {
  buildFederalRosterRows,
  stateLegislatorsToRosterRows,
} from "@/app/lib/repRoster";
import { stateDistrictHasLegislator } from "./repsPageClient.helpers";

/** Federal district label → style rank for map/legend alignment. */
export function computeFederalDistrictRankByLabel(
  geo: RepsByAddressPayload["districtGeoJson"],
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

export function computeFederalHouseColors(
  districts: RepsByAddressPayload["data"]["districts"],
  districtRankByLabel: Map<string, number>,
): FederalHouseColorsByDistrict {
  return federalHouseColorsForDistricts(districts, districtRankByLabel);
}

export function computeFederalRosterRows(
  data: RepsByAddressPayload["data"],
  federalHouseColors: FederalHouseColorsByDistrict,
) {
  return buildFederalRosterRows(data, federalHouseColors);
}

export function computeAlignedStateDistricts(
  stateDistricts: RepsByAddressPayload["data"]["stateDistricts"],
  stateLegislators: RepsByAddressPayload["data"]["stateLegislators"],
) {
  if (!stateLegislators.length) return stateDistricts;
  const matched = stateDistricts.filter((d) =>
    stateDistrictHasLegislator(d, stateLegislators),
  );
  return matched.length > 0 ? matched : stateDistricts;
}

export function computeAlignedStateDistrictGeoJson(
  geo: RepsByAddressPayload["data"]["stateDistrictGeoJson"],
  stateLegislators: RepsByAddressPayload["data"]["stateLegislators"],
  alignedStateDistricts: ReturnType<typeof computeAlignedStateDistricts>,
) {
  if (!geo?.features?.length) return geo;
  if (!stateLegislators.length) return geo;

  const allowed = new Set(alignedStateDistricts.map((d) => d.mapKey));
  const features = geo.features.filter((f) =>
    allowed.has(String(f.properties?.mapKey ?? "")),
  );
  if (features.length === 0) return geo;
  return { type: "FeatureCollection" as const, features };
}

export function computeStateDistrictRankByMapKey(
  stateGeo: ReturnType<typeof computeAlignedStateDistrictGeoJson>,
): Map<string, number> {
  const rankByKey = new Map<string, number>();
  if (!stateGeo) return rankByKey;

  const styleIndexByName = districtStyleIndexByName(stateGeo.features);
  stateGeo.features.forEach((feature, i) => {
    const name = districtFeatureName(feature.properties?.name, i);
    const rank = styleIndexByName.get(name);
    if (rank == null) return;
    const mapKey = String(feature.properties?.mapKey ?? "");
    if (mapKey && !rankByKey.has(mapKey)) {
      rankByKey.set(mapKey, rank);
    }
  });

  return rankByKey;
}

export function computeStateDistrictColorFillByMapKey(
  stateDistrictRankByMapKey: Map<string, number>,
): Map<string, string> {
  const m = new Map<string, string>();
  for (const [mapKey, rank] of stateDistrictRankByMapKey) {
    m.set(mapKey, paletteForDistrictRank(rank).fill);
  }
  return m;
}

export function computeStateRosterRows(
  stateLegislators: RepsByAddressPayload["data"]["stateLegislators"],
  alignedStateDistricts: ReturnType<typeof computeAlignedStateDistricts>,
  stateDistrictColorFillByMapKey: Map<string, string>,
) {
  return stateLegislatorsToRosterRows(
    stateLegislators,
    alignedStateDistricts,
    stateDistrictColorFillByMapKey,
  );
}

export function filterStateSenateDistricts<
  T extends { chamberKey: string },
>(aligned: T[]) {
  return aligned.filter((d) => d.chamberKey === "upper");
}

export function filterStateHouseDistricts<
  T extends { chamberKey: string },
>(aligned: T[]) {
  return aligned.filter((d) => d.chamberKey === "lower");
}
