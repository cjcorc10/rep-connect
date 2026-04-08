/**
 * Reads index.jsonl and writes PostgreSQL-compatible SQL for upserting into
 * state_legislator_images (see schema.sql). Pipe to psql or run in a SQL client.
 *
 * Usage: pnpm state-leg-images:import-sql > import.sql
 */
import fs from "node:fs";
import path from "node:path";
import type { LegislatorImageIndexRow } from "./fetch-index";

function cliArgs(argv: string[]): string[] {
  return argv.slice(2).filter((a) => !/\.(ts|js)$/i.test(a));
}

function parseArgs() {
  let indexPath = path.join(
    process.cwd(),
    "data",
    "state-legislator-images",
    "index.jsonl",
  );
  const args = cliArgs(process.argv);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--index" && args[i + 1]) {
      indexPath = path.resolve(args[++i]!);
    }
  }
  return { indexPath };
}

function sqlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

function readJsonl(filePath: string): LegislatorImageIndexRow[] {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${filePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const rows: LegislatorImageIndexRow[] = [];
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      rows.push(JSON.parse(t) as LegislatorImageIndexRow);
    } catch {
      /* skip */
    }
  }
  return rows;
}

function main() {
  const { indexPath } = parseArgs();
  const rows = readJsonl(indexPath);

  process.stderr.write(
    "-- SQL to stdout only (redirect to file): pnpm state-leg-images:import-sql > import-index.sql\n",
  );
  console.log("BEGIN;\n");

  const batch = 80;
  for (let i = 0; i < rows.length; i += batch) {
    const chunk = rows.slice(i, i + batch);
    const values = chunk
      .map(
        (r) =>
          `(${sqlString(r.ocd_person_id)}, ${sqlString(r.state)}, ${sqlString(r.current_chamber)}, ${sqlString(r.current_district)}, ${sqlString(r.full_name)}, ${sqlString(r.image_source_url)}, ${sqlString(r.indexed_at)}::timestamptz)`,
      )
      .join(",\n");

    console.log(`INSERT INTO state_legislator_images (
  ocd_person_id, state, current_chamber, current_district, full_name,
  image_source_url, indexed_at
) VALUES
${values}
ON CONFLICT (ocd_person_id) DO UPDATE SET
  state = EXCLUDED.state,
  current_chamber = EXCLUDED.current_chamber,
  current_district = EXCLUDED.current_district,
  full_name = EXCLUDED.full_name,
  image_source_url = EXCLUDED.image_source_url,
  indexed_at = EXCLUDED.indexed_at;
`);
  }

  console.log("COMMIT;");
}

main();
