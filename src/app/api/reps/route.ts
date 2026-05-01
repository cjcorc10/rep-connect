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

/**
 * 
 * @api {post} /reps Resolve Legislative Data 
 * @description Coordinates geocoding and spatial lookups to identify
 * state, districts, and member information.
 * @access public
 */

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

    const coordinates = await getCoordinates(address);
        const box = getBoundsForDistrictQuery(coordinates);
    if (!box) {
      return NextResponse.json(
        { error: "Failed to get coordinates" },
        { status: 404 }
      );
    }
    const loc = coordinates.geometry.location;
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

    const place = parseGeocodePlace(coordinates);
    const cityStateLabel = formatCityStateLabel(place, state);

    return NextResponse.json({
      state,
      districts,
      houseReps,
      senateReps,
      stateLegislators: stateLegResult.legislators,
      stateError:
        "stateError" in stateLegResult
          ? stateLegResult.stateError
          : undefined,
      stateDistricts: stateDistrictResult.stateDistricts,
      stateDistrictGeoJson: stateDistrictResult.stateDistrictGeoJson,
      cityStateLabel,
      districtGeoJson,
      mapFallback: extractMapFallback(coordinates),
    });
  } catch (error) {
    console.error("Error fetching reps:", error);
    return NextResponse.json(
      { error: "Failed to fetch representatives" },
      { status: 500 }
    );
  }
}
