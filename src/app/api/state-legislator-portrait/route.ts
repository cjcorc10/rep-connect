import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase/supabaseClient";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 15_000;

/** OpenStates person ids we store in state_legislator_images.ocd_person_id */
const OCD_PERSON_ID =
  /^ocd-person\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

function isAllowedSourceUrl(raw: string): URL | null {
  const t = raw.trim();
  if (!t) return null;
  let u: URL;
  try {
    u = new URL(t);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (u.username || u.password) return null;
  return u;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ocd = searchParams.get("ocd")?.trim() ?? "";
  if (!OCD_PERSON_ID.test(ocd)) {
    return NextResponse.json({ error: "invalid_ocd" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("state_legislator_images")
    .select("image_source_url")
    .eq("ocd_person_id", ocd)
    .maybeSingle();

  if (error) {
    console.error("state_legislator_images lookup:", error.message);
    return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
  }

  const sourceUrl = isAllowedSourceUrl(data?.image_source_url ?? "");
  if (!sourceUrl) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(sourceUrl.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      headers: {
        "User-Agent": "RepConnect/1.0 (+portrait-proxy)",
        Accept: "image/*,*/*;q=0.8",
      },
      next: { revalidate: 86_400 },
    });
  } catch {
    return NextResponse.json({ error: "upstream_fetch_failed" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream_http", status: upstream.status },
      { status: 502 },
    );
  }

  const lenHeader = upstream.headers.get("content-length");
  if (lenHeader) {
    const n = Number.parseInt(lenHeader, 10);
    if (Number.isFinite(n) && n > MAX_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }
  }

  const buf = await upstream.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const contentType =
    upstream.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
