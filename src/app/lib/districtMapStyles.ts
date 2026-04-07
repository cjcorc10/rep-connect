import type { DistrictMapFeatureCollection } from "./definitions";

/** Stroke + fill pairs tuned for contrast on default map tiles. */
export const DISTRICT_PALETTE: ReadonlyArray<{
  stroke: string;
  fill: string;
}> = [
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

export function districtFeatureName(
  raw: unknown,
  fallbackIndex: number
): string {
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).trim();
  }
  return `district_${fallbackIndex}`;
}

function districtColorIndex(name: string): number {
  // Deterministic hash so a district keeps its color across reloads/refines.
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % DISTRICT_PALETTE.length;
}

/** Stable color index per distinct district name (independent of feature order). */
export function districtStyleIndexByName(
  features: DistrictMapFeatureCollection["features"]
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

/** Label text for map marker: congressional district number when parseable. */
export function districtNumberForMarker(
  fullName: unknown,
  rankZeroBased: number
): string {
  const n = fullName != null ? String(fullName).trim() : "";
  if (!n) return String(rankZeroBased + 1);
  if (/at[\s-]*large/i.test(n)) return "AL";
  const cd = n.match(/congressional\s+district\s*(\d+)/i);
  if (cd) return cd[1]!;
  const d = n.match(/district\s*(\d+)/i);
  if (d) return d[1]!;
  const tail = n.match(/(\d+)\s*$/);
  if (tail) return tail[1]!;
  return String(rankZeroBased + 1);
}

export function paletteForDistrictRank(rank: number): {
  stroke: string;
  fill: string;
} {
  const slot = rank % DISTRICT_PALETTE.length;
  return DISTRICT_PALETTE[slot]!;
}
