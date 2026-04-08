import { NextResponse } from "next/server";
import { fetchWikipediaData } from "@/app/lib/wikipedia";

/**
 * 
 * @api {get} /wikipedia Wiki-Proxy 
 * @description Fetch wiki data for member using their id
 * @access public 
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const data = await fetchWikipediaData(decodedId);

  if (!data) {
    return NextResponse.json(
      { error: "Wikipedia data not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
