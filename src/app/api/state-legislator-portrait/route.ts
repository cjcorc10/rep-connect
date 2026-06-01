import { NextResponse } from "next/server";

/**
 *
 * @api {get} /state-legislator-portrait Resolve State Legislator ocd
 * @description Retreive corresponding URL for ocd requested and return state legislator image
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const image_url = searchParams.get("image_url");

  if (!image_url)
    return Response.json(
      { error: "No image found" },
      { status: 404 },
    );

  try {
    console.log("fetching image from", image_url);
    const res = await fetch(image_url);
    if (!res.ok) throw new Error(`HTTP error! Status ${res.status}`);

    return new NextResponse(res.body, {
      headers: {
        "Content-Type":
          res.headers.get("Content-Type") || "image/jpeg",
      },
    });
  } catch (err) {
    console.error(
      "State legislator fetch attempt failed",
      err,
      image_url,
    );
  }

  return Response.json(
    { error: "No image could be loaded" },
    { status: 504 },
  );
}
