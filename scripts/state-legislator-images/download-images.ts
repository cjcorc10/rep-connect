/**
 * Reads JSONL from fetch-index.ts and downloads each image_source_url.
 * Writes files under --out, logs failures to --failures JSONL.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { LegislatorImageIndexRow } from "./fetch-index";

function cliArgs(argv: string[]): string[] {
  return argv.slice(2).filter((a) => !/\.(ts|js)$/i.test(a));
}

function parseArgs(argv: string[]) {
  let indexPath = path.join(
    process.cwd(),
    "data",
    "state-legislator-images",
    "index.jsonl",
  );
  let outDir = path.join(
    process.cwd(),
    "data",
    "state-legislator-images",
    "downloads",
  );
  let failuresPath = path.join(
    process.cwd(),
    "data",
    "state-legislator-images",
    "download-failures.jsonl",
  );
  let concurrency = 5;
  let maxRetries = 3;

  const args = cliArgs(argv);
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a === "--index" && args[i + 1]) indexPath = path.resolve(args[++i]!);
    else if (a === "--out" && args[i + 1]) outDir = path.resolve(args[++i]!);
    else if (a === "--failures" && args[i + 1])
      failuresPath = path.resolve(args[++i]!);
    else if (a === "--concurrency" && args[i + 1])
      concurrency = Math.max(1, parseInt(args[++i]!, 10) || 5);
    else if (a === "--retries" && args[i + 1])
      maxRetries = Math.max(0, parseInt(args[++i]!, 10) || 3);
  }

  return { indexPath, outDir, failuresPath, concurrency, maxRetries };
}

function readJsonl(filePath: string): LegislatorImageIndexRow[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const rows: LegislatorImageIndexRow[] = [];
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    try {
      rows.push(JSON.parse(t) as LegislatorImageIndexRow);
    } catch {
      /* skip bad line */
    }
  }
  return rows;
}

function safeFileBase(ocdPersonId: string): string {
  return ocdPersonId.replace(/\//g, "_");
}

function extFromContentType(ct: string | null): string {
  if (!ct) return ".jpg";
  const lower = ct.split(";")[0]!.trim().toLowerCase();
  if (lower.includes("png")) return ".png";
  if (lower.includes("webp")) return ".webp";
  if (lower.includes("gif")) return ".gif";
  if (lower.includes("jpeg") || lower.includes("jpg")) return ".jpg";
  return ".bin";
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchImage(
  url: string,
  maxRetries: number,
): Promise<{ ok: true; buffer: Buffer; contentType: string } | { ok: false; error: string }> {
  let lastErr = "";
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "rep-connect/state-legislator-images" },
      });
      if (!res.ok) {
        lastErr = `HTTP ${res.status}`;
      } else {
        const ct = res.headers.get("content-type");
        const buf = Buffer.from(await res.arrayBuffer());
        if (!ct?.toLowerCase().startsWith("image/")) {
          lastErr = `not an image: ${ct ?? "no content-type"}`;
        } else {
          return { ok: true, buffer: buf, contentType: ct };
        }
      }
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
    if (attempt < maxRetries) await sleep(400 * (attempt + 1));
  }
  return { ok: false, error: lastErr };
}

async function runPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function runOne(): Promise<void> {
    const i = next++;
    if (i >= items.length) return;
    results[i] = await worker(items[i]!);
    await runOne();
  }
  const starters = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    runOne(),
  );
  await Promise.all(starters);
  return results;
}

async function main() {
  const { indexPath, outDir, failuresPath, concurrency, maxRetries } = parseArgs(
    process.argv,
  );

  if (!fs.existsSync(indexPath)) {
    console.error(`Index not found: ${indexPath}\nRun: pnpm state-leg-images:index`);
    process.exit(1);
  }

  const rows = readJsonl(indexPath);
  fs.mkdirSync(outDir, { recursive: true });
  const failureLines: string[] = [];

  const withUrls = rows.filter((r) => r.image_source_url.trim());
  const skipped = rows.length - withUrls.length;

  await runPool(withUrls, concurrency, async (row) => {
    const url = row.image_source_url.trim();
    const base = safeFileBase(row.ocd_person_id);
    const result = await fetchImage(url, maxRetries);
    if (!result.ok) {
      failureLines.push(
        JSON.stringify({
          ocd_person_id: row.ocd_person_id,
          state: row.state,
          image_source_url: url,
          error: result.error,
        }),
      );
      return;
    }
    const ext = extFromContentType(result.contentType);
    const filePath = path.join(outDir, `${base}${ext}`);
    fs.writeFileSync(filePath, result.buffer);

    const hash = crypto.createHash("sha256").update(result.buffer).digest("hex");
    const metaPath = path.join(outDir, `${base}.meta.json`);
    fs.writeFileSync(
      metaPath,
      JSON.stringify(
        {
          ocd_person_id: row.ocd_person_id,
          state: row.state,
          current_chamber: row.current_chamber,
          current_district: row.current_district,
          full_name: row.full_name,
          image_source_url: url,
          content_sha256: hash,
          content_type: result.contentType,
          local_filename: path.basename(filePath),
          downloaded_at: new Date().toISOString(),
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
  });

  fs.writeFileSync(
    failuresPath,
    failureLines.join("\n") + (failureLines.length ? "\n" : ""),
    "utf8",
  );

  console.log(
    `Downloaded ${withUrls.length - failureLines.length}/${withUrls.length} images to ${outDir}`,
  );
  console.log(`Skipped ${skipped} rows with empty image URL`);
  console.log(`Failures: ${failureLines.length} -> ${failuresPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
