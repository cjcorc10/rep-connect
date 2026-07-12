import type {
  DistrictMapFeatureCollection,
  Rep,
} from "@/app/lib/definitions";
import { districtsMatch } from "@/app/reps/[zip]/helper";
import {
  districtNumberForMarker,
  resolveDistrictFeatureMapKey,
  stateDistrictPaletteSlotByMapKey,
} from "@/app/lib/districtMapStyles";

const STATE_DISTRICT_COLORS = [
  "#362c28",
  "#db6c79",
  "#558b6e",
] as const;

/** Match `--democrat-*` / `--republican-*` in `districtMap.module.scss`. */
const DEMOCRAT_COLORS = ["#03045e", "#0096c7", "#90e0ef"] as const;
const REPUBLICAN_COLORS = ["#6a040f", "#9d0208", "#d00000"] as const;

export type PartyPalettes = {
  democrat: string[];
  republican: string[];
};

export const DEFAULT_STATE_DISTRICT_COLORS: string[] = [
  ...STATE_DISTRICT_COLORS,
];

export const DEFAULT_PARTY_PALETTES: PartyPalettes = {
  democrat: [...DEMOCRAT_COLORS],
  republican: [...REPUBLICAN_COLORS],
};

const STATE_DISTRICT_CSS_VARS = [
  ["--district-1"],
  ["--district-2"],
  ["--district-3"],
] as const;

const DEMOCRAT_CSS_VARS = [
  ["--democrat-1"],
  ["--democrat-2"],
  ["--democrat-3"],
] as const;

const REPUBLICAN_CSS_VARS = [
  ["--republican-1"],
  ["--republican-2"],
  ["--republican-3"],
] as const;

export const DISTRICT_POLYGON = {
  strokeWeight: 4,
  fillOpacity: 0.45,
  zIndex: 1,
} as const;

export const SEARCH_AREA = {
  strokeWeight: 4,
  fillOpacity: 0,
  strokeOpacity: 0.9,
  zIndex: 20,
  strokeColor: "#252525",
} as const;

function readCssColorPalette(
  element: HTMLElement,
  cssVars: readonly (readonly string[])[],
  fallbacks: readonly string[],
): string[] {
  const styles = getComputedStyle(element);
  return fallbacks.map((fallback, i) => {
    for (const varName of cssVars[i] ?? []) {
      const value = styles.getPropertyValue(varName).trim();
      if (value) return value;
    }
    return fallback;
  });
}

/** State map palette — districts 1–3 only. */
export function readStateDistrictColors(
  element: HTMLElement,
): string[] {
  return readCssColorPalette(
    element,
    STATE_DISTRICT_CSS_VARS,
    STATE_DISTRICT_COLORS,
  );
}

/** Federal party palettes from `.map` (`--democrat-1..3`, `--republican-1..3`). */
export function readPartyPalettes(
  element: HTMLElement,
): PartyPalettes {
  return {
    democrat: readCssColorPalette(
      element,
      DEMOCRAT_CSS_VARS,
      DEMOCRAT_COLORS,
    ),
    republican: readCssColorPalette(
      element,
      REPUBLICAN_CSS_VARS,
      REPUBLICAN_COLORS,
    ),
  };
}

function normalizeParty(
  party: string,
): "democrat" | "republican" | "other" {
  const value = party.trim().toLowerCase();
  if (value.startsWith("dem") || value === "d") return "democrat";
  if (value.startsWith("rep") || value === "r") return "republican";
  return "other";
}

/** Spread district labels evenly across palette slots (same approach as state). */
function paletteSlotByLabel(
  labels: string[],
  paletteLength: number,
): Map<string, number> {
  const sorted = [...new Set(labels)].sort();
  const slots = new Map<string, number>();
  const count = sorted.length;
  const maxSlot = Math.max(0, paletteLength - 1);

  sorted.forEach((label, i) => {
    const slot =
      count <= 1 ? 0 : Math.round((i * maxSlot) / (count - 1));
    slots.set(label, slot);
  });

  return slots;
}

type FederalColorEntry = {
  mapKey: string;
  districtLabel: string;
  party: ReturnType<typeof normalizeParty>;
};

/** One row per distinct federal district feature (same order as map color assignment). */
function buildFederalColorEntries(
  features: DistrictMapFeatureCollection["features"],
  houseReps: Rep[],
): FederalColorEntry[] {
  const entries: FederalColorEntry[] = [];

  features.forEach((feature, i) => {
    const mapKey = resolveDistrictFeatureMapKey(
      feature.properties,
      i,
      "federal",
    );
    if (!mapKey || entries.some((entry) => entry.mapKey === mapKey))
      return;

    const districtLabel = districtNumberForMarker(
      feature.properties?.name,
      entries.length,
    );
    const rep = houseReps.find((houseRep) =>
      districtsMatch(String(houseRep.district), districtLabel),
    );
    const party = normalizeParty(rep?.party ?? "");

    entries.push({ mapKey, districtLabel, party });
  });

  return entries;
}

function assignFederalPartyColors(
  entries: FederalColorEntry[],
  palettes: PartyPalettes,
): Map<string, string> {
  const demLabels: string[] = [];
  const repLabels: string[] = [];

  for (const { districtLabel, party } of entries) {
    if (party === "democrat") demLabels.push(districtLabel);
    if (party === "republican") repLabels.push(districtLabel);
  }

  const demSlots = paletteSlotByLabel(
    demLabels,
    palettes.democrat.length,
  );
  const repSlots = paletteSlotByLabel(
    repLabels,
    palettes.republican.length,
  );

  const byMapKey = new Map<string, string>();

  for (const { mapKey, districtLabel, party } of entries) {
    if (party === "democrat") {
      const slot = demSlots.get(districtLabel) ?? 0;
      byMapKey.set(
        mapKey,
        palettes.democrat[slot % palettes.democrat.length]!,
      );
      continue;
    }
    if (party === "republican") {
      const slot = repSlots.get(districtLabel) ?? 0;
      byMapKey.set(
        mapKey,
        palettes.republican[slot % palettes.republican.length]!,
      );
    }
  }

  return byMapKey;
}

/** Stable state district key → palette color (districts 1–3). */
export function buildStateDistrictColorByMapKey(
  features: DistrictMapFeatureCollection["features"],
  colors: string[],
): Map<string, string> {
  const result = new Map<string, string>();
  if (colors.length === 0) return result;

  const slots = stateDistrictPaletteSlotByMapKey(features);
  for (const [mapKey, slot] of slots) {
    result.set(mapKey, colors[slot % colors.length]!);
  }

  return result;
}

/**
 * Federal district mapKey → one of the party palette shades.
 * Democrats cycle `--democrat-1..3`; Republicans cycle `--republican-1..3`.
 */
export function buildFederalPartyColorByMapKey(
  features: DistrictMapFeatureCollection["features"],
  houseReps: Rep[],
  palettes: PartyPalettes,
): Map<string, string> {
  return assignFederalPartyColors(
    buildFederalColorEntries(features, houseReps),
    palettes,
  );
}

/** Federal district number label → party palette shade (for legend). */
export function buildFederalPartyColorByDistrictLabel(
  features: DistrictMapFeatureCollection["features"],
  houseReps: Rep[],
  palettes: PartyPalettes = DEFAULT_PARTY_PALETTES,
): Map<string, string> {
  const entries = buildFederalColorEntries(features, houseReps);
  const byMapKey = assignFederalPartyColors(entries, palettes);
  const byDistrict = new Map<string, string>();

  for (const { mapKey, districtLabel } of entries) {
    const color = byMapKey.get(mapKey);
    if (!color) continue;

    byDistrict.set(districtLabel, color);

    const rep = houseReps.find((houseRep) =>
      districtsMatch(String(houseRep.district), districtLabel),
    );
    if (rep) {
      byDistrict.set(String(rep.district), color);
    }
  }

  return byDistrict;
}

export function districtPolygonStyle(
  color: string,
): google.maps.Data.StyleOptions {
  return {
    strokeColor: color,
    fillColor: color,
    strokeWeight: DISTRICT_POLYGON.strokeWeight,
    fillOpacity: DISTRICT_POLYGON.fillOpacity,
    zIndex: DISTRICT_POLYGON.zIndex,
  };
}

export function searchAreaPolygonStyle(): google.maps.Data.StyleOptions {
  return {
    strokeColor: SEARCH_AREA.strokeColor,
    fillOpacity: SEARCH_AREA.fillOpacity,
    strokeWeight: SEARCH_AREA.strokeWeight,
    strokeOpacity: SEARCH_AREA.strokeOpacity,
    zIndex: SEARCH_AREA.zIndex,
  };
}
