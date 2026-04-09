import { NextResponse } from "next/server";
import { fetchWikipediaBestImageUrl } from "@/app/lib/wikipedia";

/**
 * @api {get} /rep-image Image-Proxy
 * @description Wikipedia (hi-res) → Congress.gov → optional fallback URL.
 * Tries each candidate until one returns a successful image response.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wikipediaId = searchParams.get("wikipedia_id");
  const bioguideId = searchParams.get("bioguide_id");
  const fallbackImage = searchParams.get("fallback");

  if (!wikipediaId && !bioguideId) {
    return NextResponse.json(
      { error: "wikipedia_id or bioguide_id required" },
      { status: 400 },
    );
  }

  const candidates: string[] = [];

  if (wikipediaId) {
    const wiki = await fetchWikipediaBestImageUrl(wikipediaId);
    if (wiki) candidates.push(wiki);
  }

  if (bioguideId) {
    candidates.push(
      `https://www.congress.gov/img/member/${bioguideId}.jpg`,
    );
    candidates.push(
      `https://www.congress.gov/img/member/${bioguideId}_200.jpg`,
    );
  }

  if (fallbackImage) candidates.push(fallbackImage);

  if (candidates.length === 0)
    return NextResponse.json(
      { error: "No image found" },
      { status: 404 },
    );

  let lastStatus = 0;
  for (const imageUrl of candidates) {
    try {
      console.log("fetching image from:", imageUrl);
      const response = await fetch(imageUrl, {
        next: { revalidate: 864000 },
      });

      if (!response.ok) {
        lastStatus = response.status;
        continue;
      }

      const contentType = response.headers.get("Content-Type") || "";
      if (contentType && !contentType.startsWith("image/")) {
        continue;
      }

      return new NextResponse(response.body, {
        headers: {
          "Content-Type": contentType || "image/jpeg",
          "Cache-Control": "public, max-age=864000, s-maxage=864000",
        },
      });
    } catch (err) {
      console.error("rep-image fetch attempt failed:", imageUrl, err);
    }
  }

  console.error(
    "rep-image: all candidates failed; last upstream status:",
    lastStatus,
  );
  return NextResponse.json(
    { error: "No image could be loaded" },
    { status: 502 },
  );
}
