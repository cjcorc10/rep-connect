import { NextResponse } from "next/server";
import {
  extractMapFallback,
  formatCityStateLabel,
  getBoundsForDistrictQuery,
  getCoordinates,
  getDistricts,
  parseGeocodePlace,
} from "@/app/lib/util";
import { getHouseReps, getSenators } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const { address } = (await req.json()) as {
      address: string;
    };
    if (!address)
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );

    const geo = await getCoordinates(address);
    if (
      !geo ||
      geo.status !== "OK" ||
      !geo.results ||
      geo.results.length === 0
    ) {
      return NextResponse.json(
        { error: "Failed to get coordinates" },
        { status: 404 }
      );
    }

    const box = getBoundsForDistrictQuery(geo.results[0]);
    if (!box) {
      return NextResponse.json(
        { error: "Failed to get coordinates" },
        { status: 404 }
      );
    }
    const { state, districts, districtGeoJson } =
      await getDistricts(box);

    const [houseRepsResult, senateReps] = await Promise.all([
      getHouseReps(districts, state),
      getSenators(state),
    ]);

    const houseReps = houseRepsResult || [];

    const place = parseGeocodePlace(geo.results[0]);
    const cityStateLabel = formatCityStateLabel(
      place,
      state,
      address
    );

    return NextResponse.json({
      state,
      districts,
      houseReps,
      senateReps,
      cityStateLabel,
      districtGeoJson,
      mapFallback: extractMapFallback(geo.results[0]),
    });
  } catch (error) {
    console.error("Error fetching reps:", error);
    return NextResponse.json(
      { error: "Failed to fetch representatives" },
      { status: 500 }
    );
  }
}
