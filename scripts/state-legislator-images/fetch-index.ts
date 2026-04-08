/**
 * Downloads Open States nightly current-legislator CSVs (one per state/DC)
 * and writes a JSONL index: ocd-person id, chamber, district, name, image URL.
 *
 * Source: https://data.openstates.org/people/current/<state>.csv
 * Docs: https://openstates.org/data/legislator-csv/
 */
import fs from "node:fs";
import path from "node:path";
import { OPEN_STATES_PEOPLE_CSV_BASE, STATE_ABBRS_LOWER } from "./constants";
import { parseCsv, rowsToObjects } from "./csv";

export type LegislatorImageIndexRow = {
  ocd_person_id: string;
  state: string;
  current_chamber: string;
  current_district: string;
  full_name: string;
  image_source_url: string;
  indexed_at: string;
};

function normalizeOcdPersonId(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (t.startsWith("ocd-person/")) return t;
  return `ocd-person/${t.replace(/^ocd-person:/, "")}`;
}

function cliArgs(argv: string[]): string[] {
  return argv.slice(2).filter((a) => !/\.(ts|js)$/i.test(a));
}

function parseArgs(argv: string[]) {
  let outPath = path.join(
    process.cwd(),
    "data",
    "state-legislator-images",
    "index.jsonl",
  );
  const states = new Set<string>();
  const args = cliArgs(argv);
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a === "--out" && args[i + 1]) {
      outPath = path.resolve(args[++i]!);
    } else if (a === "--states" && args[i + 1]) {
      for (const s of args[++i]!.split(",")) {
        const x = s.trim().toLowerCase();
        if (x) states.add(x);
      }
    }
  }
  const list =
    states.size > 0
      ? STATE_ABBRS_LOWER.filter((s) => states.has(s))
      : [...STATE_ABBRS_LOWER];
  return { outPath, states: list };
}

async function fetchCsv(abbr: string): Promise<string> {
  const url = `${OPEN_STATES_PEOPLE_CSV_BASE}/${abbr}.csv`;
  const res = await fetch(url, {
    headers: { "User-Agent": "rep-connect/state-legislator-images" },
  });
  if (!res.ok) {
    throw new Error(`${abbr}: HTTP ${res.status} ${url}`);
  }
  return res.text();
}

function rowToIndexEntry(
  row: Record<string, string>,
  stateUpper: string,
  indexedAt: string,
): LegislatorImageIndexRow | null {
  const id = normalizeOcdPersonId(row["id"] ?? "");
  const name = (row["name"] ?? "").trim();
  const image = (row["image"] ?? "").trim();
  const chamber = (row["current_chamber"] ?? "").trim();
  const district = (row["current_district"] ?? "").trim();
  if (!id || !name) return null;
  return {
    ocd_person_id: id,
    state: stateUpper,
    current_chamber: chamber,
    current_district: district,
    full_name: name,
    image_source_url: image,
    indexed_at: indexedAt,
  };
}

async function main() {
  const { outPath, states } = parseArgs(process.argv);
  const dir = path.dirname(outPath);
  fs.mkdirSync(dir, { recursive: true });

  const indexedAt = new Date().toISOString();
  const lines: string[] = [];
  const errors: string[] = [];

  for (const abbr of states) {
    try {
      const text = await fetchCsv(abbr);
      const rows = rowsToObjects(parseCsv(text));
      const stateUpper = abbr.toUpperCase();
      for (const row of rows) {
        const entry = rowToIndexEntry(row, stateUpper, indexedAt);
        if (entry) lines.push(JSON.stringify(entry));
      }
    } catch (e) {
      const msg =
        e instanceof Error
          ? `${e.message}${e.cause != null ? ` (${String(e.cause)})` : ""}`
          : String(e);
      errors.push(`${abbr}: ${msg}`);
    }
  }

  fs.writeFileSync(outPath, lines.join("\n") + (lines.length ? "\n" : ""), "utf8");

  if (errors.length) {
    const errPath = outPath.replace(/\.jsonl$/i, ".errors.txt");
    fs.writeFileSync(errPath, errors.join("\n") + "\n", "utf8");
    console.error(`Wrote ${errors.length} fetch errors to ${errPath}`);
  }

  console.log(
    `Wrote ${lines.length} rows to ${outPath} (${states.length} jurisdictions attempted)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
