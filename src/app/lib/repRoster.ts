import type { FederalHouseColorsByDistrict } from "./districtMapStyles";
import type { Rep, StateDistrict, StateLegislator } from "./definitions";
import { districtsMatch } from "@/app/reps/[zip]/helper";
import { buildRepImageApiUrl } from "./repImageUrl";

export type RepRosterRow = {
  id: string;
  shortName: string;
  fullName: string;
  imageUrl: string;
  /** Federal: `/api/rep-image?…` for next/image src (proxied image). */
  portraitSrc?: string;
  portraitProxyOcdId?: string;
  phone?: string;
  externalUrl?: string;
  chamber: string;
  district: string;
  termEndDisplay: string;
  termHighlightMidterm?: boolean;
  districtColorFill?: string;
};

export function nextMidtermElectionYear(from: Date = new Date()): number {
  let y = from.getFullYear();
  for (;;) {
    while (y % 4 !== 2) y += 1;
    const electionCutoff = new Date(y, 10, 15);
    if (from.getTime() <= electionCutoff.getTime()) return y;
    y += 4;
  }
}

export function termEndsAtNextMidterm(
  termEnd: Date,
  from: Date = new Date(),
): boolean {
  if (termEnd.getTime() <= from.getTime()) return false;
  const m = nextMidtermElectionYear(from);
  const y = termEnd.getFullYear();
  return y === m || y === m + 1;
}

export function shortNameFromFullName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    const only = parts[0]!;
    return only.length ? `${only[0]!}.` : "";
  }
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${first[0]!}.${last}`;
}

export function repToRosterRow(
  rep: Rep,
  federalHouseColors?: FederalHouseColorsByDistrict,
): RepRosterRow {
  const chamber = rep.type === "sen" ? "Senate" : "House";
  const district = rep.type === "sen" ? rep.state : rep.district;
  const termEndDate = new Date(rep.end);
  const termEndDisplay = termEndDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const dc =
    rep.type === "sen"
      ? undefined
      : federalHouseColors?.[String(rep.district)];

  return {
    id: rep.bioguide_id,
    shortName: `${rep.first_name[0]}.${rep.last_name}`,
    fullName: rep.full_name,
    imageUrl: rep.image_url?.trim() ?? "",
    portraitSrc: buildRepImageApiUrl(rep),
    phone: rep.phone?.trim() || undefined,
    chamber,
    district,
    termEndDisplay,
    termHighlightMidterm: termEndsAtNextMidterm(termEndDate),
    districtColorFill: dc?.fill,
  };
}

export function buildFederalRosterRows(
  repsData: { senateReps: Rep[]; houseReps: Rep[] },
  federalHouseColors?: FederalHouseColorsByDistrict,
): RepRosterRow[] {
  const reps = repsData.senateReps.concat(repsData.houseReps);
  return reps.map((r) => repToRosterRow(r, federalHouseColors));
}

function chamberSortKey(k: string): number {
  if (k === "upper") return 0;
  if (k === "lower") return 1;
  return 2;
}

function normalizeStateChamberLabel(label: string): string {
  return label.replace(/^State\s+/i, "").trim();
}

function formatStateDistrictDisplay(district: string): string {
  const t = district.trim();
  if (!t) return t;
  if (/^\d+$/.test(t)) {
    return String(parseInt(t, 10));
  }
  return t;
}

function formatOptionalTermEnd(isoDate?: string): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export function stateLegislatorsToRosterRows(
  members: StateLegislator[],
  alignedDistricts: StateDistrict[],
  districtColorFillByMapKey: Map<string, string>,
): RepRosterRow[] {
  const sorted = [...members].sort((a, b) => {
    const ca = chamberSortKey(a.chamberKey);
    const cb = chamberSortKey(b.chamberKey);
    if (ca !== cb) return ca - cb;
    return a.full_name.localeCompare(b.full_name);
  });

  return sorted.map((m) => {
    const sd = alignedDistricts.find(
      (d) =>
        d.chamberKey === m.chamberKey &&
        districtsMatch(d.district, m.district),
    );
    const fill = sd
      ? districtColorFillByMapKey.get(sd.mapKey)
      : undefined;

    return {
      id: `${m.id}-${m.chamberKey}-${m.district}`,
      shortName: shortNameFromFullName(m.full_name),
      fullName: m.full_name,
      imageUrl: "",
      portraitProxyOcdId: m.id.trim() || undefined,
      phone: m.phone?.trim() || undefined,
      externalUrl: m.url?.trim() || undefined,
      chamber: normalizeStateChamberLabel(m.chamber),
      district: formatStateDistrictDisplay(m.district),
      termEndDisplay: formatOptionalTermEnd(m.term_end),
      termHighlightMidterm: false,
      districtColorFill: fill,
    };
  });
}
