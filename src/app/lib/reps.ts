import type { RepsByAddressPayload, RepsData } from "./definitions";
import {
  extractMapFallback,
  formatCityStateLabel,
  getBoundsForDistrictQuery,
  getCoordinates,
  getDistricts,
  getStateLegislativeDistricts,
  parseGeocodePlace,
} from "./util";
import { getHouseReps, getSenators } from "./db";
import { fetchStateLegislatorsByLatLng } from "./openstates";

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

  const loc = first.geometry.location;
  const [
    { state, districts, districtGeoJson },
    stateLegResult,
    stateDistrictResult,
  ] =
    await Promise.all([
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
