import type { StateLegislator } from "./definitions";

const OPENSTATES_BASE = "https://v3.openstates.org";

type OsJurisdiction = {
  id?: string;
  classification?: string;
  name?: string;
};

type OsRole = {
  title?: string;
  org_classification?: string;
  district?: string | number;
  division_id?: string;
  jurisdiction?: OsJurisdiction;
  end_date?: string;
};

type OsPerson = {
  id?: string;
  name?: string;
  party?: string;
  image?: string;
  openstates_url?: string;
  current_role?: OsRole;
  roles?: OsRole[];
  jurisdiction?: OsJurisdiction;
  contact_details?: Array<{ type?: string; value?: string }>;
};

type OsGeoResponse = {
  results?: OsPerson[];
};

function isStateJurisdiction(j?: OsJurisdiction): boolean {
  const id = j?.id ?? "";
  return (
    j?.classification === "state" ||
    (id.includes("/state:") && id.includes("/government"))
  );
}

/** Normalize API `org_classification` or infer from title (handles missing/variant values). */
function classifyStateLegislativeChamber(
  role: OsRole,
): "upper" | "lower" | "legislature" | null {
  const cls = role.org_classification?.toLowerCase()?.trim();
  if (cls === "upper" || cls === "lower" || cls === "legislature") {
    return cls;
  }

  const title = (role.title ?? "").trim();
  const tl = title.toLowerCase();
  if (!title) return null;

  if (
    tl.includes("u.s. senator") ||
    tl.includes("u.s. representative") ||
    tl.includes("united states senator") ||
    tl.includes("united states representative") ||
    tl.includes("us representative") ||
    tl.includes("us senator")
  ) {
    return null;
  }

  if (
    tl.includes("state senator") ||
    (tl.includes("senator") && !tl.includes("representative"))
  ) {
    return "upper";
  }

  if (
    tl.includes("state representative") ||
    tl.includes("state rep") ||
    tl.includes("representative") ||
    tl.includes("delegate") ||
    tl.includes("assembly member") ||
    /^rep\.?\s/i.test(title)
  ) {
    return "lower";
  }

  return null;
}

type PickedRole = {
  role: OsRole;
  chamber: "upper" | "lower" | "legislature";
};

function pickStateLegislativeRole(
  person: OsPerson,
): PickedRole | null {
  const candidates: OsRole[] = [];
  if (person.current_role) candidates.push(person.current_role);
  if (Array.isArray(person.roles)) candidates.push(...person.roles);

  const matches: PickedRole[] = [];

  for (const role of candidates) {
    const j = role.jurisdiction ?? person.jurisdiction;
    if (!isStateJurisdiction(j)) continue;

    const chamber = classifyStateLegislativeChamber(role);
    if (!chamber) continue;

    matches.push({ role, chamber });
  }

  if (matches.length === 0) return null;

  if (person.current_role) {
    const byCurrent = matches.find(
      (m) => m.role === person.current_role,
    );
    if (byCurrent) return byCurrent;
  }

  return matches[0]!;
}

function chamberLabel(
  chamber: "upper" | "lower" | "legislature",
): string {
  switch (chamber) {
    case "upper":
      return "State Senate";
    case "lower":
      return "State House";
    case "legislature":
      return "Legislature";
    default:
      return "State";
  }
}

function voiceFromContacts(
  details?: Array<{ type?: string; value?: string }>,
): string {
  if (!Array.isArray(details)) return "";
  const v = details.find(
    (d) => d.type === "voice" && d.value?.trim(),
  );
  return v?.value?.trim() ?? "";
}

function normalizeIsoDate(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

function extractRoleTermEnd(
  person: OsPerson,
  picked: PickedRole,
): string | undefined {
  const direct = normalizeIsoDate(picked.role.end_date);
  if (direct) return direct;

  const roles: OsRole[] = [];
  if (Array.isArray(person.roles)) roles.push(...person.roles);

  const sameChamber = roles.filter((role) => {
    const j = role.jurisdiction ?? person.jurisdiction;
    if (!isStateJurisdiction(j)) return false;
    return classifyStateLegislativeChamber(role) === picked.chamber;
  });

  const now = Date.now();
  const normalized = sameChamber
    .map((r) => normalizeIsoDate(r.end_date))
    .filter((d): d is string => Boolean(d));
  if (!normalized.length) return undefined;

  const upcoming = normalized
    .map((d) => ({ iso: d, t: new Date(d).getTime() }))
    .filter((d) => d.t >= now)
    .sort((a, b) => a.t - b.t);
  if (upcoming.length) return upcoming[0]!.iso;

  const latestPast = normalized
    .map((d) => ({ iso: d, t: new Date(d).getTime() }))
    .sort((a, b) => b.t - a.t)[0];
  return latestPast?.iso;
}

function normalizePerson(person: OsPerson): StateLegislator | null {
  const id = person.id?.trim();
  const name = person.name?.trim();
  if (!id || !name) return null;

  const picked = pickStateLegislativeRole(person);
  if (!picked) return null;

  const { role, chamber } = picked;
  const district =
    role.district != null ? String(role.district).trim() : "";
  const url =
    person.openstates_url?.trim() ??
    `https://openstates.org/find_your_legislator/`;

  return {
    id,
    full_name: name,
    party: person.party?.trim() ?? "",
    chamber: chamberLabel(chamber),
    chamberKey: chamber,
    district: district || "—",
    term_end: extractRoleTermEnd(person, picked),
    image_url: person.image?.trim() ?? "",
    url,
    phone: voiceFromContacts(person.contact_details),
  };
}

/**
 * State legislators whose districts contain the given point (OpenStates people.geo).
 * Requires OPENSTATES_API_KEY. Returns empty list if key missing or request fails.
 */
export async function fetchStateLegislatorsByLatLng(
  lat: number,
  lng: number,
): Promise<{
  legislators: StateLegislator[];
  stateError?: string;
}> {
  const apiKey = process.env.OPENSTATES_API_KEY?.trim();
  if (!apiKey) {
    return { legislators: [], stateError: "missing_api_key" };
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    per_page: "50",
  });

  try {
    const res = await fetch(
      `${OPENSTATES_BASE}/people.geo?${params.toString()}`,
      {
        headers: {
          "X-API-KEY": apiKey,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return {
        legislators: [],
        stateError: `http_${res.status}`,
      };
    }
    const json = (await res.json()) as OsGeoResponse;
    const raw = json.results ?? [];
    const seen = new Set<string>();
    const legislators: StateLegislator[] = [];

    for (const p of raw) {
      const leg = normalizePerson(p);
      if (!leg) continue;
      const dedupeKey = `${leg.id}|${leg.chamberKey}|${leg.district}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      legislators.push(leg);
    }

    legislators.sort((a, b) => {
      const chamberOrder = (k: string) =>
        k === "upper" ? 0 : k === "lower" ? 1 : 2;
      const ca = chamberOrder(a.chamberKey);
      const cb = chamberOrder(b.chamberKey);
      if (ca !== cb) return ca - cb;
      return a.full_name.localeCompare(b.full_name);
    });

    return { legislators };
  } catch {
    return { legislators: [], stateError: "fetch_failed" };
  }
}
