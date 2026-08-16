import type { DistrictMapFeatureCollection } from "./definitions";

/** One district’s map colors (outline + fill). */
export type DistrictSwatch = {
  stroke: string;
  fill: string;
};

/**
 * For each House district number (string key), the swatch used on the map and roster.
 * (Senate rows do not use this lookup.)
 */
export type FederalHouseColorsByDistrict = {
  [district: string]: DistrictSwatch;
};

/** Federal / default district colors (hash-assigned per district). */
export const DISTRICT_PALETTE: ReadonlyArray<DistrictSwatch> = [
  { stroke: "#1d4ed8", fill: "#3b82f6" },
  { stroke: "#b45309", fill: "#f59e0b" },
  { stroke: "#047857", fill: "#34d399" },
  { stroke: "#6d28d9", fill: "#a78bfa" },
  { stroke: "#b91c1c", fill: "#f87171" },
  { stroke: "#0e7490", fill: "#22d3ee" },
  { stroke: "#a16207", fill: "#eab308" },
  { stroke: "#be123c", fill: "#fb7185" },
  { stroke: "#4338ca", fill: "#818cf8" },
  { stroke: "#15803d", fill: "#4ade80" },
];

/**
 * State district colors — hues spread for contrast (no purple/indigo cluster).
 * Assigned by sorted map key so nearby district counts pick opposite slots.
 */
export const STATE_DISTRICT_PALETTE: ReadonlyArray<DistrictSwatch> = [
  { stroke: "#1d4ed8", fill: "#3b82f6" },
  { stroke: "#b45309", fill: "#f59e0b" },
  { stroke: "#047857", fill: "#34d399" },
  { stroke: "#be123c", fill: "#fb7185" },
  { stroke: "#0e7490", fill: "#22d3ee" },
  { stroke: "#c2410c", fill: "#fb923c" },
];

export function districtFeatureName(
  raw: unknown,
  fallbackIndex: number,
): string {
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).trim();
  }
  return `district_${fallbackIndex}`;
}

function districtColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % DISTRICT_PALETTE.length;
}

/** Stable key for map styling — state uses `mapKey` (e.g. `upper:5`), federal uses district name. */
export function resolveDistrictFeatureMapKey(
  properties: Record<string, unknown> | undefined,
  featureIndex: number,
  level: "federal" | "state",
): string {
  if (level === "state") {
    const mapKey = String(properties?.mapKey ?? "").trim();
    if (mapKey) return mapKey;
  }
  return districtFeatureName(properties?.name, featureIndex);
}

/** Stable color index per distinct district name (independent of feature order). */
export function districtStyleIndexByName(
  features: DistrictMapFeatureCollection["features"],
): Map<string, number> {
  const map = new Map<string, number>();
  features.forEach((f, i) => {
    const name = districtFeatureName(f.properties?.name, i);
    if (!map.has(name)) {
      map.set(name, districtColorIndex(name));
    }
  });
  return map;
}

/** Strip leading zeros from pure numeric district labels (e.g. "03" → "3"). */
function normalizeDistrictNumberLabel(value: string): string {
  if (/^\d+$/.test(value)) {
    return String(parseInt(value, 10));
  }
  return value;
}

/** Label text for map marker: congressional district number when parseable. */
export function districtNumberForMarker(
  fullName: unknown,
  rankZeroBased: number,
): string {
  const n = fullName != null ? String(fullName).trim() : "";
  if (!n) return String(rankZeroBased + 1);
  if (/at[\s-]*large/i.test(n)) return "AL";
  const cd = n.match(/congressional\s+district\s*(\d+)/i);
  if (cd) return normalizeDistrictNumberLabel(cd[1]!);
  const d = n.match(/district\s*(\d+)/i);
  if (d) return normalizeDistrictNumberLabel(d[1]!);
  const tail = n.match(/(\d+)\s*$/);
  if (tail) return normalizeDistrictNumberLabel(tail[1]!);
  return String(rankZeroBased + 1);
}

export function paletteForDistrictRank(rank: number): DistrictSwatch {
  const slot = rank % DISTRICT_PALETTE.length;
  return DISTRICT_PALETTE[slot]!;
}

export function statePaletteForSlot(slot: number): DistrictSwatch {
  const index = slot % STATE_DISTRICT_PALETTE.length;
  return STATE_DISTRICT_PALETTE[index]!;
}

/** Fallback swatch from a stable district key hash (federal). */
export function paletteSwatchForMapKey(mapKey: string): DistrictSwatch {
  return paletteForDistrictRank(districtColorIndex(mapKey));
}

/**
 * Evenly spaces palette slots across sorted state district keys so two districts
 * (e.g. upper + lower) land on opposite hues instead of similar hash collisions.
 */
export function stateDistrictPaletteSlotByMapKey(
  features: DistrictMapFeatureCollection["features"],
): Map<string, number> {
  const keys = new Set<string>();
  features.forEach((feature, i) => {
    const mapKey = resolveDistrictFeatureMapKey(
      feature.properties,
      i,
      "state",
    );
    if (mapKey) keys.add(mapKey);
  });

  const sorted = [...keys].sort();
  const count = sorted.length;
  const slots = new Map<string, number>();
  const maxSlot = STATE_DISTRICT_PALETTE.length - 1;

  sorted.forEach((mapKey, i) => {
    const slot =
      count <= 1 ? 0 : Math.round((i * maxSlot) / (count - 1));
    slots.set(mapKey, slot);
  });

  return slots;
}

/** District feature key → palette swatch for map polygons and labels. */
export function buildDistrictSwatchByMapKey(
  features: DistrictMapFeatureCollection["features"],
  level: "federal" | "state",
): Map<string, DistrictSwatch> {
  const swatches = new Map<string, DistrictSwatch>();

  if (level === "state") {
    const slots = stateDistrictPaletteSlotByMapKey(features);
    for (const [mapKey, slot] of slots) {
      swatches.set(mapKey, statePaletteForSlot(slot));
    }
    return swatches;
  }

  features.forEach((feature, i) => {
    const mapKey = resolveDistrictFeatureMapKey(
      feature.properties,
      i,
      level,
    );
    if (!mapKey || swatches.has(mapKey)) return;
    swatches.set(mapKey, paletteSwatchForMapKey(mapKey));
  });
  return swatches;
}

export function stateSwatchForMapKey(
  mapKey: string,
  features: DistrictMapFeatureCollection["features"],
): DistrictSwatch {
  const slot = stateDistrictPaletteSlotByMapKey(features).get(mapKey);
  if (slot == null) return paletteSwatchForMapKey(mapKey);
  return statePaletteForSlot(slot);
}

/**
 * Builds “district number → colors” so the House roster row can use the same swatch as the map legend.
 */
export function federalHouseColorsForDistricts(
  districts: (string | number)[],
  rankByDistrictLabel: Map<string, number>,
): FederalHouseColorsByDistrict {
  const colors: FederalHouseColorsByDistrict = {};
  districts.forEach((district, index) => {
    const key = String(district);
    const rank = rankByDistrictLabel.get(key) ?? index;
    colors[key] = paletteForDistrictRank(rank);
  });
  return colors;
}
