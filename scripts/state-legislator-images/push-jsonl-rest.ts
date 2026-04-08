/**
 * Upserts rows from index.jsonl into Supabase via PostgREST (service role).
 * No DATABASE_URL required — uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage: set -a && . ./.env && set +a && pnpm state-leg-images:push-supabase
 */
import fs from "node:fs";
import readline from "node:readline";
import path from "node:path";

const BATCH = 200;

type Row = {
  ocd_person_id: string;
  state: string;
  current_chamber: string;
  current_district: string;
  full_name: string;
  image_source_url: string;
  indexed_at: string;
};

function cliArgs(argv: string[]): string[] {
  return argv.slice(2).filter((a) => !/\.(ts|js)$/i.test(a));
}

async function flush(
  url: string,
  key: string,
  rows: Row[],
): Promise<void> {
  if (rows.length === 0) return;
  const endpoint = `${url.replace(/\/$/u, "")}/rest/v1/state_legislator_images?on_conflict=ocd_person_id`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
}

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!baseUrl || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
    process.exit(1);
  }

  const args = cliArgs(process.argv);
  const jsonlPath = path.resolve(
    args[0] ?? path.join(process.cwd(), "data/state-legislator-images/index.jsonl"),
  );

  if (!fs.existsSync(jsonlPath)) {
    console.error(`File not found: ${jsonlPath}`);
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(jsonlPath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let batch: Row[] = [];
  let total = 0;
  let lineNo = 0;

  for await (const line of rl) {
    lineNo++;
    const t = line.trim();
    if (!t) continue;
    let row: Row;
    try {
      row = JSON.parse(t) as Row;
    } catch {
      console.error(`Invalid JSON at line ${lineNo}`);
      process.exit(1);
    }
    batch.push(row);
    if (batch.length >= BATCH) {
      await flush(baseUrl, key, batch);
      total += batch.length;
      process.stderr.write(`… ${total} rows\r`);
      batch = [];
    }
  }

  await flush(baseUrl, key, batch);
  total += batch.length;
  console.error(`\nUpserted ${total} rows from ${jsonlPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
