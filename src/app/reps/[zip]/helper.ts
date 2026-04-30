import type { Rep, StateDistrict, StateLegislator } from "@/app/lib/definitions";

export function formatStateDistrictDisplay(district: string): string {
  const trimmed = district.trim();
  if (!trimmed) return trimmed;
  if (/^\d+$/.test(trimmed)) {
    return String(parseInt(trimmed, 10));
  }
  return trimmed;
}

export function districtsMatch(a: string, b: string): boolean {
  const x = a.trim();
  const y = b.trim();
  if (x === y) return true;
  const xNum = Number(x);
  const yNum = Number(y);
  const isXInt = Number.isInteger(xNum) && /^\d+$/.test(x);
  const isYInt = Number.isInteger(yNum) && /^\d+$/.test(y);
  return isXInt && isYInt && xNum === yNum;
}

export function lastNameFromFullName(name: string): string {
  const parts = name.split(" ");
  return parts[parts.length - 1] ?? "";
}

export function federalHouseLastName(
  houseReps: Rep[],
  district: string,
): string {
  const rep = houseReps.find((h) =>
    districtsMatch(String(h.district), String(district)),
  );
  return rep?.last_name?.trim() ?? "";
}

export function stateLegislatorLastName(
  members: StateLegislator[],
  chamberKey: StateLegislator["chamberKey"],
  district: string,
): string {
  const m = members.find(
    (x) => x.chamberKey === chamberKey && districtsMatch(x.district, district),
  );
  return m ? lastNameFromFullName(m.full_name) : "";
}

/** ArcGIS envelope can return many districts; keep rows that match a people.geo legislator. */
export function stateDistrictHasLegislator(
  d: StateDistrict,
  legislators: StateLegislator[],
): boolean {
  if (!legislators.length) return true;
  return legislators.some(
    (m) =>
      m.chamberKey === d.chamberKey &&
      districtsMatch(m.district, d.district),
  );
}
