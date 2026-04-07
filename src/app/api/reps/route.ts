import { NextResponse } from "next/server";
import {
  extractMapFallback,
  formatCityStateLabel,
  getBoundsForDistrictQuery,
  getCoordinates,
  getDistricts,
  getStateLegislativeDistricts,
  parseGeocodePlace,
} from "@/app/lib/util";
import { getHouseReps, getSenators } from "@/app/lib/db";
import { fetchStateLegislatorsByLatLng } from "@/app/lib/openstates";

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
    const loc = geo.results[0].geometry.location;
    const [
      { state, districts, districtGeoJson },
      stateLegResult,
      stateDistrictResult,
    ] =
      await Promise.all([
        getDistricts(box),
        loc
          ? fetchStateLegislatorsByLatLng(loc.lat, loc.lng)
          : Promise.resolve({ legislators: [] }),
        getStateLegislativeDistricts(box).catch(() => ({
          stateDistricts: [],
          stateDistrictGeoJson: null,
        })),
      ]);

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
      stateLegislators: stateLegResult.legislators,
      stateError: stateLegResult.stateError,
      stateDistricts: stateDistrictResult.stateDistricts,
      stateDistrictGeoJson: stateDistrictResult.stateDistrictGeoJson,
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
