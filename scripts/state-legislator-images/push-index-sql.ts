/**
 * Runs import-index.sql (or path from argv) against Postgres using DATABASE_URL.
 * Use the Supabase Session pooler URI on IPv4-only networks.
 *
 * Usage: DATABASE_URL='postgresql://...' pnpm state-leg-images:push-sql
 */
import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

function cliArgs(argv: string[]): string[] {
  return argv.slice(2).filter((a) => !/\.(ts|js)$/i.test(a));
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error(
      "Missing DATABASE_URL. Set your Supabase Session pooler connection string.",
    );
    process.exit(1);
  }

  const args = cliArgs(process.argv);
  const sqlPath = path.resolve(
    args[0] ?? path.join(process.cwd(), "import-index.sql"),
  );

  if (!fs.existsSync(sqlPath)) {
    console.error(`File not found: ${sqlPath}`);
    process.exit(1);
  }

  let sql = fs.readFileSync(sqlPath, "utf8");
  const bi = sql.indexOf("BEGIN;");
  if (bi >= 0) sql = sql.slice(bi);
  sql = sql.replace(/\s*COMMIT;\s*$/u, "").trim();

  const statements = sql
    .split(/\n(?=INSERT INTO state_legislator_images)/u)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("INSERT INTO"));

  if (statements.length === 0) {
    console.error("No INSERT statements found after BEGIN;");
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query("BEGIN");
    for (let i = 0; i < statements.length; i++) {
      await client.query(statements[i]!);
      if ((i + 1) % 20 === 0 || i === statements.length - 1) {
        process.stderr.write(`… ${i + 1}/${statements.length} batches\r`);
      }
    }
    await client.query("COMMIT");
    console.error(`\nApplied ${statements.length} INSERT batches from ${sqlPath}`);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
