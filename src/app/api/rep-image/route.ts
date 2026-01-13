import { NextResponse } from "next/server";
import { fetchWikipediaData } from "@/app/lib/wikipedia";

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

  // Try Wikipedia first (highest quality)
  if (wikipediaId) {
    const wikiData = await fetchWikipediaData(wikipediaId);
    if (wikiData?.originalimage?.source) {
      return NextResponse.json({
        imageUrl: wikiData.originalimage.source,
        source: "wikipedia",
      });
    }
  }

  // Fallback to Congress.gov if bioguide_id is available
  if (bioguideId) {
    const congressImageUrl = `https://www.congress.gov/img/member/${bioguideId.toLowerCase()}.jpg`;
    
    // Verify the image exists by checking the response
    try {
      const checkRes = await fetch(congressImageUrl, { method: "HEAD" });
      if (checkRes.ok) {
        return NextResponse.json({
          imageUrl: congressImageUrl,
          source: "congress",
        });
      }
    } catch (error) {
      console.error("Error checking Congress.gov image:", error);
    }
  }

  // Return fallback if provided
  if (fallbackImage) {
    return NextResponse.json({
      imageUrl: fallbackImage,
      source: "fallback",
    });
  }

  return NextResponse.json(
    { error: "No image found" },
    { status: 404 }
  );
}
