import { NextResponse } from "next/server";
import { fetchWikipediaBestImageUrl } from "@/app/lib/wikipedia";

/**
 * 
 * @api {get} /rep-image Image-Proxy
 * @description Orchestrates a fallback strategy for member images prioritizing
 * wikipedia (hi-res) over congress.gov.
 * @access public
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wikipediaId = searchParams.get("wikipedia_id");
  const bioguideId = searchParams.get("bioguide_id");
  const fallbackImage = searchParams.get("fallback");

  if (!wikipediaId && !bioguideId) {
    return NextResponse.json(
      { error: "wikipedia_id or bioguide_id required" },
      { status: 400 }
    );
  }

  let requestURL: string | null = null;
  // Try Wikipedia first (original / page media / thumbnail)
  if (wikipediaId) requestURL = await fetchWikipediaBestImageUrl(wikipediaId);

  // Fallback to Congress.gov if bioguide_id is available
  if (!requestURL && bioguideId) {
    const congressImageUrl = `https://www.congress.gov/img/member/${bioguideId.toLowerCase()}.jpg`;
    
    // Verify the image exists by checking the response
    const checkRes = await fetch(congressImageUrl, { method: "HEAD" });
    if (checkRes.ok) requestURL = congressImageUrl
  }
  // use fallback if provided
  if (!requestURL && fallbackImage) requestURL = fallbackImage
  if (!requestURL) return NextResponse.json({ error: "No image found" }, { status: 404 })


  try {
    const response = await fetch(requestURL, {
      next: { revalidate: 864000}
    })

    if (!response.ok) throw new Error("Upstream failure");

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=864000, s-maxage=864000",
      }
    });
  } catch (error) {
    console.error("Proxy error: ", error)
    return new NextResponse("Error fetching image", {status: 502})
  }
}
