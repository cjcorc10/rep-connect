import type { RepsData, RepsLocationPayload } from "./definitions";
import {
  extractMapFallback,
  getBoundsForDistrictQuery,
  getDistricts,
  getStateLegislativeDistricts,
  type GeocodeResult,
} from "./util";
import { getHouseReps, getSenators } from "./db";
import { fetchStateLegislatorsByLatLng } from "./openstates";
import { cacheLife } from "next/cache";

/** Server-only: fetch reps for a geocoded point. Returns null when bounds cannot be resolved (404). */
export async function getRepsByLocationQuery(
  location: GeocodeResult,
): Promise<RepsLocationPayload | null> {
  "use cache";
  cacheLife("weeks");
  const bounds = getBoundsForDistrictQuery(location);
  if (!bounds) return null;
  const loc = location.geometry.location;
  const [
    { state, districts, districtGeoJson },
    stateLegResult,
    stateDistrictResult,
  ] = await Promise.all([
    getDistricts(bounds),
    loc
      ? fetchStateLegislatorsByLatLng(loc.lat, loc.lng)
      : Promise.resolve({
          legislators: [] as RepsData["stateLegislators"],
        }),
    getStateLegislativeDistricts(bounds).catch(() => ({
      stateDistricts: [] as RepsData["stateDistricts"],
      stateDistrictGeoJson: null,
    })),
  ]);

  const [houseRepsResult, senateReps] = await Promise.all([
    getHouseReps(districts, state),
    getSenators(state),
  ]);

  const houseReps = houseRepsResult ?? [];

  const data: RepsData = {
    state,
    districts,
    houseReps,
    senateReps,
    stateLegislators: stateLegResult.legislators,
    stateDistricts: stateDistrictResult.stateDistricts,
    stateDistrictGeoJson: stateDistrictResult.stateDistrictGeoJson,
  };

  return {
    data,
    districtGeoJson,
    mapFallback: extractMapFallback(location),
  };
}
