import type { Rep, StateLegislator } from "./definitions";

export function buildFederalImageApiUrl(rep: Rep): string {
  const params = new URLSearchParams();
  params.set("bioguide_id", rep.bioguide_id);
  if (rep.wikipedia_id) params.set("wikipedia_id", rep.wikipedia_id);
  if (rep.image_url) params.set("fallback", rep.image_url);
  return `/api/rep-image?${params.toString()}`;
}

export const buildStateImageApiURL = (
  rep: StateLegislator,
): string => {
  const params = new URLSearchParams();
  if (rep.image_url) params.set("image_url", rep.image_url);
  return `/api/state-legislator-portrait?${params.toString()}`;
};
