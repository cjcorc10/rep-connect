import type { RepsData } from "./definitions";
import { getDistricts, getCoordinates } from "./util";
import { getHouseReps, getSenators } from "./db";

/** Server-only: fetch reps by address. Returns null when address cannot be resolved (404). */
export async function getRepsByAddress(
  address: string
): Promise<RepsData | null> {
  const geo = await getCoordinates(address);
  if (
    !geo ||
    geo.status !== "OK" ||
    !geo.results ||
    geo.results.length === 0
  ) {
    return null;
  }

  const { northeast, southwest } = geo.results[0].geometry.bounds;
  const { state, districts } = await getDistricts({
    northeast,
    southwest,
  });

  const [houseRepsResult, senateReps] = await Promise.all([
    getHouseReps(districts, state),
    getSenators(state),
  ]);

  const houseReps = houseRepsResult ?? [];

  return {
    state,
    districts,
    houseReps,
    senateReps,
  };
}
