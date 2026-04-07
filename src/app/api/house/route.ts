import { NextResponse } from "next/server";
import {
  getBoundsForDistrictQuery,
  getCoordinates,
  getDistricts,
} from "@/app/lib/util";
import { getHouseReps } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const { street, zip } = (await req.json()) as {
      street: string;
      zip: string;
    };
    if (!zip)
      return NextResponse.json(
        { error: "ZIP code is required" },
        { status: 400 }
      );

    const address = street ? `${street}, ${zip}` : zip;
    const geo = await getCoordinates(address);
    const first = geo?.results?.[0];
    if (!first)
      return NextResponse.json(
        { error: "Failed to get coordinates" },
        { status: 500 }
      );

    const box = getBoundsForDistrictQuery(first);
    if (!box)
      return NextResponse.json(
        { error: "Failed to get coordinates" },
        { status: 500 }
      );

    const { state, districts } = await getDistricts(box);
    const reps = await getHouseReps(districts, state);

    return NextResponse.json({ state, districts, reps });
  } catch {
    return NextResponse.json({ error: "Server" }, { status: 500 });
  }
}
