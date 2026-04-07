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
  jurisdiction?: OsJurisdiction;
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

function pickStateLegislativeRole(person: OsPerson): OsRole | null {
  const candidates: OsRole[] = [];
  if (person.current_role) candidates.push(person.current_role);
  if (Array.isArray(person.roles)) candidates.push(...person.roles);

  for (const role of candidates) {
    const cls = role.org_classification;
    if (
      cls !== "upper" &&
      cls !== "lower" &&
      cls !== "legislature"
    ) {
      continue;
    }
    const j = role.jurisdiction ?? person.jurisdiction;
    if (isStateJurisdiction(j)) return role;
  }

  if (person.current_role) {
    const cls = person.current_role.org_classification;
    if (
      (cls === "upper" ||
        cls === "lower" ||
        cls === "legislature") &&
      isStateJurisdiction(person.jurisdiction)
    ) {
      return person.current_role;
    }
  }

  return null;
}

function chamberLabel(orgClassification?: string): string {
  switch (orgClassification) {
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

function normalizePerson(person: OsPerson): StateLegislator | null {
  const id = person.id?.trim();
  const name = person.name?.trim();
  if (!id || !name) return null;

  const role = pickStateLegislativeRole(person);
  if (!role) return null;

  const district =
    role.district != null ? String(role.district).trim() : "";
  const url =
    person.openstates_url?.trim() ??
    `https://openstates.org/find_your_legislator/`;

  return {
    id,
    full_name: name,
    party: person.party?.trim() ?? "",
    chamber: chamberLabel(role.org_classification),
    chamberKey: role.org_classification ?? "unknown",
    district: district || "—",
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
      if (!leg || seen.has(leg.id)) continue;
      seen.add(leg.id);
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
