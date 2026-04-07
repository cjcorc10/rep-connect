import type { RepsByAddressPayload, RepsData } from "./definitions";
import {
  extractMapFallback,
  formatCityStateLabel,
  getBoundsForDistrictQuery,
  getCoordinates,
  getDistricts,
  parseGeocodePlace,
} from "./util";
import { getHouseReps, getSenators } from "./db";

/** Server-only: fetch reps by address. Returns null when address cannot be resolved (404). */
export async function getRepsByAddress(
  address: string,
  zipFromRoute?: string
): Promise<RepsByAddressPayload | null> {
  const geo = await getCoordinates(address);
  if (
    !geo ||
    geo.status !== "OK" ||
    !geo.results ||
    geo.results.length === 0
  ) {
    return null;
  }

  const first = geo.results[0];
  const bounds = getBoundsForDistrictQuery(first);
  if (!bounds) {
    return null;
  }

  const { state, districts, districtGeoJson } =
    await getDistricts(bounds);

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
  };

  const place = parseGeocodePlace(first);
  const cityStateLabel = formatCityStateLabel(
    place,
    state,
    zipFromRoute ?? address
  );

  return {
    data,
    cityStateLabel,
    districtGeoJson,
    mapFallback: extractMapFallback(first),
  };
}
